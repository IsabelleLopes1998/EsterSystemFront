import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CompraService } from '../compra.service';
import { CompraResponse } from './compra.model';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-compra-listar',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PrimeNgModule,
    ToastModule,
    DividerModule,
    BreadcrumbModule,
    PaginatorModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  
  templateUrl: './compra-listar.component.html',
  styleUrls: ['./compra-listar.component.css'],
})
export class CompraListarComponent {
  @Input() TITULO = 'Lista de compras';
  compras: CompraResponse[] = [];
  comprasFiltradas: CompraResponse[] = [];
  pesquisar: string = '';
  isLoading = true;
  modalExclusaoVisivel = false;
  compraSelecionada?: CompraResponse;

  constructor(
    private compraService: CompraService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListaDeCompras();
  }

  // criarNovaCompra() {
  //   this.router.navigate(['/compra-criar-nova']);
  // }

  getListaDeCompras(): void {
    this.isLoading = true;

    this.compraService
      .getListaDeCompras()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.compras = res;
          this.comprasFiltradas = [...res];
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar lista de compras.',
          });
        },
      });
  }

  // confirmarExclusao(compra: CompraResponse) {
  //   this.compraSelecionada = compra;
  //   this.modalExclusaoVisivel = true;
  // } 
  }
