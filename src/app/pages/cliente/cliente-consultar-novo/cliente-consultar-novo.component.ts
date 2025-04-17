import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { PaginatorModule } from 'primeng/paginator';
import { TreeSelectModule } from 'primeng/treeselect';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { ClienteService } from '../cliente.service';
import { ClienteCNPJ } from './clienteCNPJ.model';
import { Sintegra } from './sintegra.model';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-cliente-consultar-novo',
  standalone: true,
  imports: [
    ReactiveFormsModule, PrimeNgModule, AccordionModule, PaginatorModule, BreadcrumbModule, CommonModule, DialogModule,
    TreeSelectModule, InputMaskModule, ToastModule, OverlayPanelModule, ProgressSpinnerModule, DialogModule
  ],
  templateUrl: './cliente-consultar-novo.component.html',
  styleUrls: ['./cliente-consultar-novo.component.css']
})
export class ClienteConsultarNovoComponent {
  breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];
  cnpjForm: FormGroup;
  sintegraForm: FormGroup;
  cliente?: ClienteCNPJ;
  sintegraData?: Sintegra;

  isCnpjValid = false;
  isSintegraValid = false;
  isLoadingCnpj = false; // 🚀 Spinner para a consulta de CNPJ
  isLoadingSintegra = false; // 🚀 Spinner para a consulta do Sintegra

  ufs = [
    { key: 'AC', label: 'Acre' }, { key: 'AL', label: 'Alagoas' }, { key: 'AP', label: 'Amapá' }, { key: 'AM', label: 'Amazonas' },
    { key: 'BA', label: 'Bahia' }, { key: 'CE', label: 'Ceará' }, { key: 'DF', label: 'Distrito Federal' }, { key: 'ES', label: 'Espírito Santo' },
    { key: 'GO', label: 'Goiás' }, { key: 'MA', label: 'Maranhão' }, { key: 'MT', label: 'Mato Grosso' }, { key: 'MS', label: 'Mato Grosso do Sul' },
    { key: 'MG', label: 'Minas Gerais' }, { key: 'PA', label: 'Pará' }, { key: 'PB', label: 'Paraíba' }, { key: 'PR', label: 'Paraná' },
    { key: 'PE', label: 'Pernambuco' }, { key: 'PI', label: 'Piauí' }, { key: 'RJ', label: 'Rio de Janeiro' }, { key: 'RN', label: 'Rio Grande do Norte' },
    { key: 'RS', label: 'Rio Grande do Sul' }, { key: 'RO', label: 'Rondônia' }, { key: 'RR', label: 'Roraima' }, { key: 'SC', label: 'Santa Catarina' },
    { key: 'SP', label: 'São Paulo' }, { key: 'SE', label: 'Sergipe' }, { key: 'TO', label: 'Tocantins' }
  ];
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private messageService: MessageService
  ) {
    // Form para consulta de CNPJ
    this.cnpjForm = this.fb.group({
      cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]]
    });

    // Form para consulta no Sintegra
    this.sintegraForm = this.fb.group({
      cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]],
      uf: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cnpjForm.valueChanges.subscribe(() => this.validarCnpjForm());
    this.sintegraForm.valueChanges.subscribe(() => this.validarSintegraForm());
  }

  validarCnpjForm() {
    const cnpjValido = this.cnpjForm.get('cnpj')?.value.replace(/\D/g, '').length === 14;
    this.isCnpjValid = cnpjValido;
  }

  validarSintegraForm() {
    const cnpjValido = this.sintegraForm.get('cnpj')?.value.replace(/\D/g, '').length === 14;
    const ufValido = !!this.sintegraForm.get('uf')?.value;
    this.isSintegraValid = cnpjValido && ufValido;
  }

  limparCnpjForm(): void {
    this.cnpjForm.reset(); // Reseta o formulário
    this.cliente = undefined; // Limpa os dados retornados
    this.isCnpjValid = false; // Desabilita o botão de busca até novo preenchimento
  }

  limparSintegraForm(): void {
    this.sintegraForm.reset(); // Reseta o formulário
    this.sintegraData = undefined; // Limpa os dados retornados
    this.isSintegraValid = false; // Desabilita o botão de busca até novo preenchimento
  }


  consultarCNPJ(): void {
    const cnpj = this.cnpjForm.get('cnpj')?.value.replace(/\D/g, ''); // Remove máscara

    if (!this.isCnpjValid) return;

    this.isLoadingCnpj = true; // Ativa spinner 🚀

    this.clienteService.consultarClientePorCNPJ(cnpj).subscribe(
      (data: ClienteCNPJ) => {
        console.log('Dados recebidos:', data);
        this.cliente = data;
        this.isLoadingCnpj = false; // Desativa spinner 🚀
      },
      error => {
        console.error('Erro ao buscar cliente:', error);
        this.isLoadingCnpj = false; // Desativa spinner em caso de erro 🚀
      }
    );
  }

  consultarSintegra(): void {
    let cnpj = this.sintegraForm.get('cnpj')?.value.replace(/\D/g, ''); // Remove máscara
    const uf = this.sintegraForm.get('uf')?.value?.key; // Obtém apenas a sigla da UF

    if (!this.isSintegraValid) return;

    this.isLoadingSintegra = true; // Ativa spinner 🚀

    const payload = {
      uf: uf,
      cnpj: cnpj,
      ie: "",
      ieProdutor: "",
      cpf: ""
    };

    console.log("📤 Enviando payload para Sintegra:", payload);

    this.clienteService.consultarSintegra(payload).subscribe(
      (data: Sintegra) => {
        console.log('✅ Dados do Sintegra recebidos:', data);

        if (data.code !== 200) {
          // 🔥 Se o backend retornar erro, exibir a mensagem
          this.errorMessage = data.codeMessage || "Erro ao consultar o Sintegra.";
          this.sintegraData = null;
        } else {
          // ✅ Se sucesso, limpar erro e mostrar os dados
          this.sintegraData = data;
          this.errorMessage = "";
        }

        this.isLoadingSintegra = false; // 🚀 Desativa o spinner
      },
      (error) => {
        console.error('❌ Erro ao consultar Sintegra:', error);
        this.errorMessage = error.error?.codeMessage || "Erro inesperado ao consultar o Sintegra.";
        this.isLoadingSintegra = false; // 🚀 Desativa o spinner em caso de erro
      }
    );
  }

  adicionarCliente() {
    if (!this.cliente) {
      return;
    }

    const dadosCliente = {
      cnpj: this.cliente.cnpj,
      nome: this.cliente.nome, // Ajuste correto, pois no HTML o campo usa "nome"
      telefone: this.cliente.telefone || '',
      email: this.cliente.email || ''
    };

    this.router.navigate(['/cliente-criar-novo'], { state: { cliente: dadosCliente } });
  }



  applyCnpjMask(value: string, formControl: AbstractControl | null): string {
    if (!formControl) return value;

    let cnpj = value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cnpj.length > 14) {
      cnpj = cnpj.slice(0, 14);
    }

    // Aplica a máscara no formato CNPJ: XX.XXX.XXX/XXXX-XX
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

    formControl.setValue(cnpj, { emitEvent: false });

    return cnpj;
  }
  
}
