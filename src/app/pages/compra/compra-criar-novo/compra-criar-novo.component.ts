import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';

import { CompraService } from '../compra.service';
import { ProdutoService } from '../../produto/produto.service';
import { CompraRequest, CompraItemRequest } from '../compra-listar/compra.model';

@Component({
  selector: 'app-compra-criar-novo',
  standalone: true,
  templateUrl: './compra-criar-novo.component.html',
  styleUrls: ['./compra-criar-novo.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    ToastModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    AutoCompleteModule,
    TooltipModule,
    ProgressSpinnerModule,
    CalendarModule
  ],
  providers: [MessageService]
})
export class CompraCriarNovoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  produtos: any[] = [];
  filteredProdutos: any[] = [];
  produtoSelecionado: any = null;
  quantidadeSelecionada: number = 1;
  itensCompra: CompraItemRequest[] = [];

  breadcrumbs = [
    { label: 'Início', url: '/' },
    { label: 'Compras', url: '/compra-listar' },
    { label: 'Nova Compra', url: '/compra-criar-novo' }
  ];

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private produtoService: ProdutoService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      data: [new Date(), Validators.required],
      fornecedor: ['', Validators.required]
    });

    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.getListaDeProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar produtos'
        });
      }
    });
  }

  filtrarProdutos(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredProdutos = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(query)
    );
  }

  onProdutoSelect(event: any): void {
    this.produtoSelecionado = event.value;
    this.quantidadeSelecionada = 1;
  }

  adicionarProduto(): void {
    if (!this.produtoSelecionado || !this.produtoSelecionado.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um produto válido'
      });
      return;
    }

    if (!this.quantidadeSelecionada || this.quantidadeSelecionada < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe uma quantidade válida'
      });
      return;
    }

    const jaExiste = this.itensCompra.some(item => item.produtoId === this.produtoSelecionado.id);
    if (jaExiste) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Este produto já foi adicionado'
      });
      return;
    }

    this.itensCompra.push({
      produtoId: this.produtoSelecionado.id,
      valorUnitario: this.produtoSelecionado.preco || 0,
      quantidadeVenda: this.quantidadeSelecionada
    });

    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
  }

  removerItem(index: number): void {
    this.itensCompra.splice(index, 1);
  }

  getProdutoNome(produtoId: string): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : '';
  }

  salvarCompra(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios'
      });
      return;
    }

    if (this.itensCompra.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Adicione pelo menos um item à compra'
      });
      return;
    }

    this.loading = true;

    const formValues = this.form.value;

    let data: string;
    if (formValues.data instanceof Date) {
      data = formValues.data.toISOString(); // ok para LocalDateTime
    } else {
      const parsed = new Date(formValues.data);
      data = parsed.toISOString();
    }

    const compra: CompraRequest = {
      data,
      fornecedor: formValues.fornecedor,
      itens: this.itensCompra
    };

    this.compraService.salvarCompra(compra).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Compra cadastrada com sucesso'
        });
        this.router.navigate(['/compra-listar']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar compra'
        });
        this.loading = false;
      }
    });
  }

  limparFormulario(): void {
    this.form.reset();
    this.itensCompra = [];
    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
  }
}