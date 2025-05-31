import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { ClienteService } from '../cliente.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ClienteResponse } from '../cliente-listar/cliente.model';
import { CalendarModule } from 'primeng/calendar';
import { cpfOuCnpjValido } from '../validators';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';





@Component({
  selector: 'app-cliente-criar-novo',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    InputMaskModule,
    DropdownModule,
    TreeSelectModule,
    ToastModule,
    OverlayPanelModule,
    ProgressSpinnerModule, DialogModule, CalendarModule ],
  templateUrl: './cliente-criar-novo.component.html',
  styleUrl: './cliente-criar-novo.component.css',
  providers: [MessageService]

})
export class ClienteCriarNovoComponent {
  breadcrumbs: any = [{ "label": "Início", "url": "/index" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];

  clienteForm: FormGroup;
  isFormValid: boolean = false;
  isLoading = false;
  isEditing = false;
  id: string | null = null;
  formAlterado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private messageService: MessageService

  ) {
    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

      cpf: ['', {
        validators: [
          Validators.required,
          Validators.pattern(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/),
          cpfOuCnpjValido()
        ],
        asyncValidators: [this.cpfDuplicadoValidator()], // <- aqui está o ajuste
        updateOn: 'blur'
      }],


      dataNascimento: ['', Validators.required],

      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.emailDuplicadoValidator()],
        updateOn: 'blur'
      }],


      primeiroTelefone: ['', [Validators.pattern(/\(\d{2}\)\s9\d{4}-\d{4}/)]],
      segundoTelefone: ['', [Validators.pattern(/\(\d{2}\)\s9\d{4}-\d{4}/)]],

      rua: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      numero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      complemento: ['', [Validators.required, Validators.maxLength(100)]],
      cep: ['', [Validators.required, Validators.pattern(/\d{5}-\d{3}/)]]
    });

  }
  ngOnInit() {
    this.isFormValid = this.clienteForm.valid;
    this.formAlterado = false; // Garante que inicia desabilitado

   const id = this.route.snapshot.paramMap.get('id');
   if (id) {
     this.isEditing = true;
     this.id = id; // ✅ agora será uma string UUID
     this.carregarCliente();
   }



    // Monitora mudanças nos campos do formulário
    this.clienteForm.valueChanges.subscribe(() => {
      this.isFormValid = this.clienteForm.valid;
    });
  }
  carregarCliente() {
    if (!this.id) return;

    this.isLoading = true;
    this.clienteService.getClientePorId(this.id).subscribe({
      next: (cliente) => {
          console.log('[DEBUG] cliente.dataNascimento vindo do backend:', cliente.dataNascimento);
          const data = parseDateLocal(cliente.dataNascimento);
          console.log('[DEBUG] Resultado parseDateLocal:', data);


        this.clienteForm.patchValue({
          nome: cliente.nome,
          cpf: cliente.cpf,
          dataNascimento: parseDateLocal(cliente.dataNascimento),
          email: cliente.email,
          primeiroTelefone: cliente.primeiroTelefone,
          segundoTelefone: cliente.segundoTelefone,
          rua: cliente.rua,
          numero: cliente.numero,
          complemento: cliente.complemento,
          cep: cliente.cep
        });
        console.log('[DEBUG] Tipo dataNascimento após patch:', typeof this.clienteForm.get('dataNascimento')?.value);
        console.log('[DEBUG] Valor no form:', this.clienteForm.get('dataNascimento')?.value);


        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cliente.' });
        this.isLoading = false;
      }
    });
  }

  salvarCliente() {
   console.log('[DEBUG] salvarCliente foi chamado');

     if (this.clienteForm.invalid) {
       console.log('[DEBUG] Formulário inválido');
         Object.keys(this.clienteForm.controls).forEach(campo => {
           const controle = this.clienteForm.get(campo);
           if (controle?.invalid) {
             console.log(`[ERRO] Campo inválido: ${campo}`, controle.errors);
           }
         });
         return;
     }

    this.isLoading = true; // Exibe o spinner antes do envio

    // Captura TODOS os valores do formulário, incluindo os desabilitados
    const formValues = this.clienteForm.getRawValue();

    const cliente: any = {
      cpf: formValues.cpf,
      nome: formValues.nome || '',
      dataNascimento: this.toISODate(formValues.dataNascimento),
      email: formValues.email || '',
      primeiroTelefone: formValues.primeiroTelefone,
      segundoTelefone: formValues.segundoTelefone || '',
      rua: formValues.rua || '',
      numero: formValues.numero || '',
      complemento: formValues.complemento || '',
      cep: formValues.cep || ''
    };

    console.log('Enviando para o backend:', cliente); // Verifica se os valores estão corretos no console

    if (this.isEditing && this.id) {
        cliente.id = this.id;
      this.clienteService.atualizarCliente(cliente).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente atualizado com sucesso!' });
          setTimeout(() => this.router.navigate(['/cliente-listar']), 2000);
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o cliente!' });
        }
      });
    } else {
      this.clienteService.salvarCliente(cliente).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente cadastrado com sucesso!' });
          setTimeout(() => this.router.navigate(['/cliente-listar']), 2000);
        },
        error: (err) => {
            this.isLoading = false;
            if (err.status === 409) {

                  this.messageService.add({ severity: 'warn', summary: 'CPF Duplicado', detail: 'Já existe um cliente com esse CPF.' });
                } else {
                    this.isLoading = false;
                              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar o cliente!' });
                }
        }
      });
    }
  }
   cpfDuplicadoValidator(): AsyncValidatorFn {
     return (control: AbstractControl): Observable<ValidationErrors | null> => {
       const cpf = control.value;
       if (!cpf) return of(null);

       return this.clienteService.verificarCpf(cpf, this.id).pipe(
         map((existe: boolean) => (existe ? { cpfDuplicado: true } : null)),
         catchError(() => of(null)) // <- previne o crash caso o backend quebre
       );
     };
   }




  emailDuplicadoValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) return of(null);

      return this.clienteService.verificarEmail(email, this.id).pipe(
        map(existe => (existe ? { emailDuplicado: true } : null)),
        catchError(() => of(null))
      );
    };
  }


  limparFormulario(): void {
      this.clienteForm.reset();

      this.clienteForm.patchValue({
        nome: '',
        cpf: '',
        email: '',
        primeiroTelefone: '',
        segundoTelefone: '',
        rua: '',
        numero: '',
        complemento: '',
        cep: ''
      });
    }

    applyCpfMask() {
     let valor = this.clienteForm.get('cpf')?.value || '';
       valor = valor.replace(/\D/g, '');

       if (valor.length <= 11) {
         valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
         valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
         valor = valor.replace(/\.(\d{3})(\d)/, '.$1-$2');
       } else {
         valor = valor.slice(0, 14);
         valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
         valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
         valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
         valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
       }

       this.clienteForm.get('cpf')?.setValue(valor, { emitEvent: false });
    }

    applyCepMask() {
      let cep = this.clienteForm.get('cep')?.value || '';
      cep = cep.replace(/\D/g, ''); // Remove tudo que não é número
      if (cep.length > 8) cep = cep.slice(0, 8);
      if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      this.clienteForm.get('cep')?.setValue(cep, { emitEvent: false });
    }


    applyPhoneMask(fieldName: 'primeiroTelefone' | 'segundoTelefone') {
      let phone = this.clienteForm.get(fieldName)?.value?.replace(/\D/g, '') || '';
      if (phone.length > 11) phone = phone.slice(0, 11);

      if (phone.length <= 10) {
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
      }

      this.clienteForm.get(fieldName)?.setValue(phone, { emitEvent: false });
    }


   /*  telefoneValidator(control: FormControl) {
      const value = control.value?.replace(/\D/g, '');
      if (!value || value.length < 10 || value.length > 11) {
        return { telefoneInvalido: true };
      }
      return null;
    } */


    /* applyCurrencyMask(value: string): string {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 9) {
        numericValue = numericValue.slice(0, 9);
      }
      let formattedValue = (parseFloat(numericValue) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.clienteForm.get('honorario')?.setValue(formattedValue, { emitEvent: false });

      return formattedValue;
    } */

    applyDateMask(value: string): string {
      let date = value.replace(/\D/g, '');
      if (date.length > 8) {
        date = date.slice(0, 8);
      }
      date = date.replace(/^(\d{2})(\d)/, '$1/$2');
      date = date.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
      this.clienteForm.get('vencimento')?.setValue(date, { emitEvent: false });

      return date;
    }
/* applyCnpjMask(value: string): string {
      let cnpj = value.replace(/\D/g, '');
      if (cnpj.length > 14) {
        cnpj = cnpj.slice(0, 14);
      }
      cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
      cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
      this.clienteForm.get('cnpj')?.setValue(cnpj, { emitEvent: false });

      return cnpj;
    } */

 private toISODate(data: any): string {
   if (!data) return '';

   if (typeof data === 'string') {
     const parsed = parseDateLocal(data);
     return parsed ? parsed.toISOString().split('T')[0] : '';
   }

   if (data instanceof Date) {
     return data.toISOString().split('T')[0];
   }

   return '';
 }


formatarData(event: Event) {
    const input = event.target as HTMLInputElement;
      let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não são números

      if (valor.length > 2 && valor.length <= 4) {
          valor = valor.replace(/^(\d{2})(\d+)/, '$1/$2');
      } else if (valor.length > 4) {

          valor = valor.replace(/^(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
      }

        input.value=valor;
}


}
function parseDateLocal(dateStr: string): Date | null {
  if (!dateStr) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateStr); // fallback
}



