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
import { Cliente } from '../cliente-listar/cliente.model';


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
    ProgressSpinnerModule, DialogModule],
  templateUrl: './cliente-criar-novo.component.html',
  styleUrl: './cliente-criar-novo.component.css',
  providers: [MessageService]

})
export class ClienteCriarNovoComponent {
  breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];

  tiposPagamento = [
    { key: 1, label: 'Física' },
    { key: 2, label: 'Jurídica' },
    { key: 3, label: 'Terceiros' }
  ];

  pagamentoSelecionado: string | null = null;

  diasVencimento = [
    { key: 1, label: '1' },
    { key: 5, label: '5' },
    { key: 10, label: '10' },
    { key: 15, label: '15' },
    { key: 20, label: '20' },
    { key: 25, label: '25' },
    { key: 30, label: '30' }
  ];
  diaSelecionado: number | null = null;
  
  veioDaConsulta: boolean = false;
  
  clienteForm: FormGroup;
  isFormValid: boolean = false;
  isLoading = false;
  isEditing = false;
  idCliente: number | null = null;
  formAlterado: boolean = false;
  dadosOriginais: any = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private messageService: MessageService

  ) {
    this.clienteForm = this.fb.group({
      cnpj: ['', Validators.required],
      nome: ['', Validators.required],
      nomeProprietario: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      honorario: ['', Validators.required],
      vencimento: [null, Validators.required],
      pagamento: [null, Validators.required]
    });
  }
  ngOnInit() {
    this.isFormValid = this.clienteForm.valid;
    this.formAlterado = false; // Garante que inicia desabilitado

    const state = history.state;
    if (state.cliente) {
      this.veioDaConsulta = true;

      this.clienteForm.patchValue({
        cnpj: state.cliente.cnpj,
        nome: state.cliente.nome,
        telefone: state.cliente.telefone,
        email: state.cliente.email
      });

      this.clienteForm.controls['cnpj'].disable();
      this.clienteForm.controls['nome'].disable();
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.idCliente = Number(id);
      this.carregarCliente();
    }

    // Monitora mudanças nos campos do formulário
    this.clienteForm.valueChanges.subscribe(() => {
      this.isFormValid = this.clienteForm.valid;
      this.verificarAlteracoes(); // Verifica se houve alguma modificação
    });
  }



  limparFormulario(): void {
    this.clienteForm.reset();

    this.clienteForm.patchValue({
      cnpj: '',
      nome: '',
      telefone: '',
      email: '',
      honorario: '',
      vencimento: null,
      pagamento: null
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


  carregarCliente() {
    if (!this.idCliente) return;

    this.isLoading = true;
    this.clienteService.getClientePorId(this.idCliente).subscribe({
      next: (cliente) => {
        const vencimentoSelecionado = this.diasVencimento.find(d => d.key === cliente.vencimento) || null;
        const pagamentoSelecionado = this.tiposPagamento.find(p => p.key === cliente.pagamento) || null;

        this.clienteForm.patchValue({
          nome: cliente.nome,
          nomeProprietario: cliente.nomeProprietario,
          cnpj: this.applyCnpjMask(cliente.cnpj), // Aplica a máscara antes de preencher
          telefone: this.applyPhoneMask(cliente.telefone), // Aplica a máscara antes de preencher
          email: cliente.email,
          honorario: this.applyCurrencyMask(cliente.honorario.toString()), // Converte para string antes de preencher
          vencimento: vencimentoSelecionado,
          pagamento: pagamentoSelecionado
        });

        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar cliente.' });
        this.isLoading = false;
      }
    });
  }


  verificarAlteracoes() {
    // Converte os objetos para strings JSON para fazer a comparação
    const valoresAtuais = JSON.stringify(this.clienteForm.getRawValue());
    const valoresOriginais = JSON.stringify(this.dadosOriginais);

    this.formAlterado = valoresAtuais !== valoresOriginais;
  }

  salvarCliente() {
    if (this.clienteForm.invalid) {
      return;
    }

    this.isLoading = true; // Exibe o spinner antes do envio

    // Captura TODOS os valores do formulário, incluindo os desabilitados
    const formValues = this.clienteForm.getRawValue();

    const cliente: Cliente = {
      clienteId: this.idCliente || 0, // Usa clienteId conforme a interface
      cnpj: this.clienteForm.getRawValue().cnpj || '',
      nome: this.clienteForm.getRawValue().nome || '',
      nomeProprietario: this.clienteForm.getRawValue().nomeProprietario || '',
      telefone: this.clienteForm.getRawValue().telefone || '',
      email: this.clienteForm.getRawValue().email || '',
      honorario: parseFloat(
        String(this.clienteForm.getRawValue().honorario || '0')
          .replace(/[^\d,]/g, '') // Remove tudo que não seja número ou vírgula
          .replace(',', '.') // Substitui vírgula por ponto para formato decimal
      ),
            vencimento: Number(this.clienteForm.getRawValue().vencimento?.key || this.clienteForm.getRawValue().vencimento || 0),
      pagamento: Number(this.clienteForm.getRawValue().pagamento?.key || this.clienteForm.getRawValue().pagamento || 0)
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

}  