import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { VendaService, VendaResponseDTO } from '../venda.service';
import { ProdutoService } from '../../produto/produto.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-venda-listar',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PrimeNgModule,
    BreadcrumbModule,
    ToastModule,
    TableModule,
    TooltipModule,
    FormsModule
  ],
  templateUrl: './venda-listar.component.html',
  styleUrls: ['./venda-listar.component.css'],
  providers: [MessageService]
})
export class VendaListarComponent implements OnInit {
  vendas: VendaResponseDTO[] = [];
  loading = false;
  vendaDetalhes: VendaResponseDTO | null = null;
  produtos: any[] = [];
  breadcrumbs = [
    { label: 'Início', url: '/' },
    { label: 'Vendas', url: '/venda-listar' }
  ];
  pesquisar: string = '';
  isLoading: boolean = false;

  constructor(
    private vendaService: VendaService,
    private produtoService: ProdutoService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarVendas();
  }

  carregarProdutos(): void {
    this.produtoService.getListaDeProdutos().subscribe({
      next: (produtos) => {
        console.log('Produtos carregados:', produtos);
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar produtos'
        });
      }
    });
  }

  carregarVendas(): void {
    this.loading = true;
    this.vendaService.listarVendas().subscribe({
      next: (vendas) => {
        console.log('Vendas carregadas:', vendas);
        this.vendas = vendas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar vendas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar vendas'
        });
        this.loading = false;
      }
    });
  }

  getProdutoPreco(produtoId: string): number {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.valor : 0;
  }

  getProdutoNome(produtoId: string): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : '';
  }

  toggleVendaDetalhes(venda: VendaResponseDTO): void {
    if (this.vendaDetalhes === venda) {
      this.vendaDetalhes = null;
    } else {
      this.vendaDetalhes = venda;
    }
  }

  novaVenda(): void {
    this.router.navigate(['/venda-criar-novo']);
  }

  editarVenda(id: string): void {
    this.router.navigate(['/venda-criar-novo', id]);
  }
} 