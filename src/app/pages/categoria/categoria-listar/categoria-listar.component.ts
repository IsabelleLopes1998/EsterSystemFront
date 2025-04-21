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
import { CategoriaService } from '../categoria.service';
import { CategoriaResponse } from './categoria.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-categoria-listar',
  standalone: true,
  imports: [ReactiveFormsModule,
      PrimeNgModule,
      AccordionModule,
      DividerModule,
      BreadcrumbModule,
      PaginatorModule,
      HttpClientModule,
      CommonModule,
      ToastModule,
      ProgressSpinnerModule],
  templateUrl: './categoria-listar.component.html',
  styleUrl: './categoria-listar.component.css'
})
export class CategoriaListarComponent {
    @ViewChild(PaginatorModule) paginator: PaginatorModule;
      @Input() TITULO = 'Lista de categorias';
      @Input() veiculoData: CategoriaResponse[] = [];
      breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Lista de categorias", "url": "#/categoria-listar" }];
      Categoria: CategoriaResponse[] = [];
      totalElements: number = 0;
      pageSize: number = 5;
      pageIndex: number = 0;
      expandedRows: { [key: string]: boolean } = {};
      CategoriasFiltradas: any[] = [];
      pesquisar: string = '';
      isLoading = true;

      first: number = 0;
      rows: number = 10;
      modalExclusaoVisivel = false;
      categoriaSelecionado!: CategoriaResponse; // Variável para armazenar o cliente que será excluído

      onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
        this.pageIndex = event.page;
        this.pageSize = event.rows;
        this.getCategorias(this.pageIndex, this.pageSize);
      }

    constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router, private categoriaService: CategoriaService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.getListaDeCategorias();
    }

    getCategorias(page: number, size: number): void {
        this.Categoria = this.Categoria.slice(page * size, (page + 1) * size);
    }

    toggleRow(row: CategoriaResponse): void {
        if (this.expandedRows[row.id]) {
          delete this.expandedRows[row.id];
        } else {
          this.expandedRows = {};
          this.expandedRows[row.id] = true;
        }
    }
    criarNovaCategoria() {
        this.router.navigate(['/categoria-criar-novo']);
    }

    getListaDeCategorias(): void {
        this.isLoading = true;

        this.categoriaService.getListaDeCategorias()
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (res: CategoriaResponse[]) => {
              if (res && res.length > 0) {
                this.Categoria = res;
                this.CategoriasFiltradas = [...this.Categoria];

                // Verifica se os IDs estão carregando corretamente
                console.log("Categorias carregadas:", this.Categoria);
              } else {
                this.Categoria = [];
                this.CategoriasFiltradas = [];
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Aviso',
                  detail: 'Nenhuma categoria encontrada.',
                  life: 3000
                });
              }
            },
            error: (error: any) => {
              console.error('Erro ao carregar categorias', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar a lista de categorias.',
                life: 5000
              });
            }
          });
    }

    editarCategoria(id: number | undefined) {
        if (!id) {
          console.error("Erro: ID da categoria está indefinido!");
          return;
        }

        this.router.navigate(['/categoria-criar-novo', id]);
      }

    confirmarExclusao(categoria: CategoriaResponse) {
        this.categoriaSelecionado = categoria;
        this.modalExclusaoVisivel = true;
    }

    excluirCategoria() {
        if (!this.categoriaSelecionado || !this.categoriaSelecionado.id) return;

        this.categoriaService.excluirCategoria(this.categoriaSelecionado.id).subscribe({
          next: () => {
            this.modalExclusaoVisivel = false;
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria excluída com sucesso!' });
            this.getListaDeCategorias(); // Atualiza a lista
          },
          error: () => {
            this.modalExclusaoVisivel = false;
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir categoria!' });
          }
        });
    }
}
