import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { ClienteService } from '../cliente.service';
import { Cliente } from './cliente.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-cliente-listar',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule, AccordionModule, DividerModule, BreadcrumbModule, PaginatorModule, HttpClientModule, CommonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './cliente-listar.component.html',
  styleUrls: ['./cliente-listar.component.css']
})
export class ClienteListarComponent {
  @ViewChild(PaginatorModule) paginator: PaginatorModule;
  @Input() TITULO = 'Lista de clientes';
  @Input() veiculoData: Cliente[] = [];
  breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Lista de clientes", "url": "#/cliente-listar" }];
  Clientes: Cliente[] = [];
  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  expandedRows: { [key: string]: boolean } = {};
  ClientesFiltrados: any[] = [];
  pesquisar: string = '';
  isLoading = true;

  first: number = 0;
  rows: number = 10;
  modalExclusaoVisivel = false;
  clienteSelecionado!: Cliente; // Variável para armazenar o cliente que será excluído

  tiposPagamento = [
    { key: 1, label: 'Física' },
    { key: 2, label: 'Jurídica' },
    { key: 3, label: 'Terceiros' }
  ];

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.getClientes(this.pageIndex, this.pageSize);
  }

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router, private clienteService: ClienteService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getListaDeClientes();
  }

  getClientes(page: number, size: number): void {
    this.Clientes = this.Clientes.slice(page * size, (page + 1) * size);
  }

  toggleRow(row: Cliente): void {
    if (this.expandedRows[row.clienteId]) {
      delete this.expandedRows[row.clienteId];
    } else {
      this.expandedRows = {};
      this.expandedRows[row.clienteId] = true;
    }
  }

  criarNovoCliente() {
    this.router.navigate(['/cliente-criar-novo']);
  }


  getListaDeClientes(): void {
    this.isLoading = true;

    this.clienteService.getListaDeClientes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: Cliente[]) => {
          if (res && res.length > 0) {
            this.Clientes = res;
            this.ClientesFiltrados = [...this.Clientes];

            // Verifica se os IDs estão carregando corretamente
            console.log("Clientes carregados:", this.Clientes);
          } else {
            this.Clientes = [];
            this.ClientesFiltrados = [];
            this.messageService.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: 'Nenhum cliente encontrado.',
              life: 3000
            });
          }
        },
        error: (error: any) => {
          console.error('Erro ao carregar clientes', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar a lista de clientes.',
            life: 5000
          });
        }
      });
  }

  filtrarClientes() {
    const pesquisa = this.pesquisar.toLowerCase();

    this.ClientesFiltrados = this.Clientes.filter(cliente => {
      // Buscar a label do tipo de pagamento
      const tipoPagamento = this.getLabelPagamento(cliente.pagamento).toLowerCase();

      return (
        cliente.nome.toLowerCase().includes(pesquisa) ||
        cliente.nomeProprietario.toLowerCase().includes(pesquisa) ||
        cliente.cnpj.toLowerCase().includes(pesquisa) ||
        cliente.telefone.toLowerCase().includes(pesquisa) ||
        cliente.email.toLowerCase().includes(pesquisa) ||
        tipoPagamento.includes(pesquisa) // ✅ Agora filtra pelo nome do tipo de pagamento
      );
    });
  }


  removerAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  getLabelPagamento(codigo: number): string {
    const tipo = this.tiposPagamento.find(tp => tp.key === codigo);
    return tipo ? tipo.label : 'Desconhecido'; // Retorna a label ou 'Desconhecido' se não encontrar
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) {
      return '';
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');
    return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  editarCliente(id: number | undefined) {
    if (!id) {
      console.error("Erro: ID do cliente está indefinido!");
      return;
    }

    this.router.navigate(['/cliente-criar-novo', id]);
  }


  // Função para abrir o modal de confirmação
  confirmarExclusao(cliente: Cliente) {
    this.clienteSelecionado = cliente;
    this.modalExclusaoVisivel = true;
  }

  // Função para excluir o cliente
  excluirCliente() {
    if (!this.clienteSelecionado || !this.clienteSelecionado.clienteId) return;

    this.clienteService.excluirCliente(this.clienteSelecionado.clienteId).subscribe({
      next: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente excluído com sucesso!' });
        this.getListaDeClientes(); // Atualiza a lista
      },
      error: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir cliente!' });
      }
    });
  }




}