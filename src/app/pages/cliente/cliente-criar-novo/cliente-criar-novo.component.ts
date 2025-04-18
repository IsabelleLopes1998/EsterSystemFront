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
  breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];

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
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      dateBirth: ['', Validators.required],
      //telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['', Validators.required],
      cep: ['', Validators.required]
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

        this.clienteForm.patchValue({
          nome: cliente.nome,
          cpf: cliente.cpf,
          //telefone: this.applyPhoneMask(cliente.telefone), // Aplica a máscara antes de preencher
          dateBirth: parseDateLocal(cliente.dateBirth),
          email: cliente.email,
          rua: cliente.rua,
          numero: cliente.numero,
          complemento: cliente.complemento,
          cep: cliente.cep
        });

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
       return;
     }

    this.isLoading = true; // Exibe o spinner antes do envio

    // Captura TODOS os valores do formulário, incluindo os desabilitados
    const formValues = this.clienteForm.getRawValue();

    const cliente: ClienteResponse = {
      id: this.id || '',
      cpf: this.clienteForm.getRawValue().cpf || '',
      nome: this.clienteForm.getRawValue().nome || '',
      dateBirth: this.toISODate(this.clienteForm.value.dateBirth),
      //telefone: this.clienteForm.getRawValue().telefone || '',
      email: this.clienteForm.getRawValue().email || '',
      rua: this.clienteForm.getRawValue().rua || '',
      numero: this.clienteForm.getRawValue().numero || '',
      complemento: this.clienteForm.getRawValue().complemento || '',
      cep: this.clienteForm.getRawValue().cep || ''
    };

    console.log('Enviando para o backend:', cliente); // Verifica se os valores estão corretos no console

    if (this.isEditing) {
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
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar o cliente!' });
        }
      });
    }
  }

  limparFormulario(): void {
      this.clienteForm.reset();

      this.clienteForm.patchValue({
        nome: '',
        cpf: '',
        //telefone: '',
        email: '',
        rua: '',
        numero: '',
        complemento: '',
        cep: ''
      });
    }


    applyCnpjMask(value: string): string {
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
    }




    applyPhoneMask(value: string): string {
      let phone = value.replace(/\D/g, '');
      if (phone.length > 11) {
        phone = phone.slice(0, 11);
      }
      if (phone.length <= 10) {
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        phone = phone.replace(/^(\d{2})(\d)/, '($1) $2');
        phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
      }
      this.clienteForm.get('telefone')?.setValue(phone, { emitEvent: false });

      return phone;
    }

    telefoneValidator(control: FormControl) {
      const value = control.value?.replace(/\D/g, '');
      if (!value || value.length < 10 || value.length > 11) {
        return { telefoneInvalido: true };
      }
      return null;
    }


    applyCurrencyMask(value: string): string {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 9) {
        numericValue = numericValue.slice(0, 9);
      }
      let formattedValue = (parseFloat(numericValue) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.clienteForm.get('honorario')?.setValue(formattedValue, { emitEvent: false });

      return formattedValue;
    }

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

 private toISODate(data: Date): string {
   if (!data) return '';
   return data.toISOString().split('T')[0]; // yyyy-MM-dd
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
     const [year, month, day] = dateStr.split('-').map(Number);
     return new Date(year, month - 1, day); // mês começa do zero
   }
