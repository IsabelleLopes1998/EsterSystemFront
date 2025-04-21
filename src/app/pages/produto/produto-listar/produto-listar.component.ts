//import { Component } from '@angular/core';
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
import { ProdutoService } from '../produto.service';
import { ProdutoResponse } from './produto.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-produto-listar',
  standalone: true,
  imports: [ReactiveFormsModule, PrimeNgModule, AccordionModule, DividerModule, BreadcrumbModule, PaginatorModule, HttpClientModule, CommonModule, ToastModule, ProgressSpinnerModule],
  templateUrl: './produto-listar.component.html',
  styleUrls: ['./produto-listar.component.css']
})
export class ProdutoListarComponent {
      @ViewChild(PaginatorModule) paginator: PaginatorModule;
      @Input() TITULO = 'Lista de produtos';
      @Input() veiculoData: ProdutoResponse[] = [];
      breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Lista de produtos", "url": "#/produto-listar" }];
      Produto : ProdutoResponse[] = [];
      totalElements: number = 0;
      pageSize: number = 5;
      pageIndex: number = 0;
      expandedRows: { [key: string]: boolean } = {};
      ProdutosFiltrados: any[] = [];
      pesquisar: string = '';
      isLoading = true;

      first: number = 0;
      rows: number = 10;
      modalExclusaoVisivel = false;
      produtoSelecionado!: ProdutoResponse; // Variável para armazenar o produto que será excluído

     onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
        this.pageIndex = event.page;
        this.pageSize = event.rows;
        this.getProdutos(this.pageIndex, this.pageSize);
      }

    constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router, private produtoService: ProdutoService, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.getListaDeProdutos();
    }

    getProdutos(page: number, size: number): void {
      this.Produto = this.Produto.slice(page * size, (page + 1) * size);
    }

    toggleRow(row: ProdutoResponse): void {
        if (this.expandedRows[row.id]) {
          delete this.expandedRows[row.id];
        } else {
          this.expandedRows = {};
          this.expandedRows[row.id] = true;
        }
      }

    criarNovoProduto() {
        this.router.navigate(['/produto-criar-novo']);
    }

    getListaDeProdutos(): void {
        this.isLoading = true;

        this.produtoService.getListaDeProdutos()
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (res: ProdutoResponse[]) => {
              if (res && res.length > 0) {
                this.Produto = res;
                this.ProdutosFiltrados = [...this.Produto];

                // Verifica se os IDs estão carregando corretamente
                console.log("Produtos carregados:", this.Produto);
              } else {
                this.Produto = [];
                this.ProdutosFiltrados = [];
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Aviso',
                  detail: 'Nenhum produto encontrado.',
                  life: 3000
                });
              }
            },
            error: (error: any) => {
              console.error('Erro ao carregar produtos', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar a lista de produtos.',
                life: 5000
              });
            }
          });
    }

    editarProduto(id: number | undefined) {
        if (!id) {
          console.error("Erro: ID do produto está indefinido!");
          return;
        }

        this.router.navigate(['/produto-criar-novo', id]);
    }

    // Função para abrir o modal de confirmação
    confirmarExclusao(produto: ProdutoResponse) {
       this.produtoSelecionado = produto;
       this.modalExclusaoVisivel = true;
    }

    //Função para excluir o produto
      excluirProduto() {
        if (!this.produtoSelecionado || !this.produtoSelecionado.id) return;

        this.produtoService.excluirProduto(this.produtoSelecionado.id).subscribe({
          next: () => {
            this.modalExclusaoVisivel = false;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído com sucesso!' });
            this.getListaDeProdutos(); // Atualiza a lista
          },
          error: () => {
            this.modalExclusaoVisivel = false;
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir produto!' });
          }
        });
      }

}
