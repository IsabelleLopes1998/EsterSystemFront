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
import { SubcategoriaService } from '../subcategoria.service';
import { SubcategoriaResponse } from './subcategoria.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-subcategoria-listar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeNgModule,
    AccordionModule,
    DividerModule,
    BreadcrumbModule,
    PaginatorModule,
    HttpClientModule,
    CommonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './subcategoria-listar.component.html',
  styleUrl: './subcategoria-listar.component.css'
})
export class SubcategoriaListarComponent {
  @ViewChild(PaginatorModule) paginator: PaginatorModule;
  @Input() TITULO = 'Lista de subcategorias';
  @Input() veiculoData: SubcategoriaResponse[] = [];

  breadcrumbs: any = [
    { label: 'Início', url: '#' },
    { label: 'Lista de subcategorias', url: '#/subcategoria-listar' }
  ];

  subcategorias: SubcategoriaResponse[] = [];
  subcategoriasFiltradas: SubcategoriaResponse[] = [];

  totalElements: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  expandedRows: { [key: string]: boolean } = {};
  pesquisar: string = '';
  isLoading = true;

  first: number = 0;
  rows: number = 10;
  modalExclusaoVisivel = false;
  subcategoriaSelecionada!: SubcategoriaResponse;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private subcategoriaService: SubcategoriaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getListaDeSubcategorias();
  }

  getSubcategorias(page: number, size: number): void {
    this.subcategorias = this.subcategorias.slice(page * size, (page + 1) * size);
  }

  toggleRow(row: SubcategoriaResponse): void {
    if (this.expandedRows[row.id]) {
      delete this.expandedRows[row.id];
    } else {
      this.expandedRows = {};
      this.expandedRows[row.id] = true;
    }
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.getSubcategorias(this.pageIndex, this.pageSize);
  }

  criarNovaSubcategoria() {
    this.router.navigate(['/subcategoria-criar-novo']);
  }

  getListaDeSubcategorias(): void {
    this.isLoading = true;
    this.subcategoriaService.getListaDeSubcategorias()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: SubcategoriaResponse[]) => {
          if (res && res.length > 0) {
            this.subcategorias = res;
            this.subcategoriasFiltradas = [...res];
          } else {
            this.subcategorias = [];
            this.subcategoriasFiltradas = [];
            this.messageService.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: 'Nenhuma subcategoria encontrada.',
              life: 3000
            });
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar a lista de subcategorias.',
            life: 5000
          });
        }
      });
  }

  editarSubcategoria(id: string | undefined) {
    if (!id) {
      console.error("Erro: ID da subcategoria está indefinido!");
      return;
    }
    this.router.navigate(['/subcategoria-criar-novo', id]);
  }

  confirmarExclusao(subcategoria: SubcategoriaResponse) {
    this.subcategoriaSelecionada = subcategoria;
    this.modalExclusaoVisivel = true;
  }

  excluirSubcategoria() {
    if (!this.subcategoriaSelecionada?.id) return;

    this.subcategoriaService.excluirSubcategoria(this.subcategoriaSelecionada.id).subscribe({
      next: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Subcategoria excluída com sucesso!'
        });
        this.getListaDeSubcategorias();
      },
      error: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao excluir subcategoria!'
        });
      }
    });
  }
}
