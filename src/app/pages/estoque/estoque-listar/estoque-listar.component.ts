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
import { EstoqueService } from '../estoque.service';
import { MovimentacaoEstoqueResponseDTO } from '../estoque.model';

interface PageEvent {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

@Component({
    selector: 'app-movimentacao-estoque-listar',
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
    templateUrl: './estoque-listar.component.html',
    styleUrls: ['./estoque-listar.component.css']
})
export class EstoqueListarComponent {
    @ViewChild(PaginatorModule) paginator: PaginatorModule;
    @Input() TITULO = 'Movimentações de Estoque';

    movimentacoesEstoque: MovimentacaoEstoqueResponseDTO[] = [];
    movimentacoesEstoqueFiltradas: MovimentacaoEstoqueResponseDTO[] = [];

    breadcrumbs: any = [
        { label: "Início", url: "#" },
        { label: "Movimentações de Estoque", url: "#/movimentacao-estoque-listar" }
    ];

    totalElements: number = 0;
    pageSize: number = 5;
    pageIndex: number = 0;
    first: number = 0;
    rows: number = 10;
    isLoading = true;

    modalExclusaoVisivel = false;
    movimentacaoSelecionada!: MovimentacaoEstoqueResponseDTO;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private estoqueService: EstoqueService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.getListaDeMovimentacoes();
        console.log(this.movimentacoesEstoque)
    }

    onPageChange(event: PageEvent) {
        this.first = event.first;
        this.rows = event.rows;
        this.pageIndex = event.page;
        this.pageSize = event.rows;
        this.getMovimentacoesPaginadas(this.pageIndex, this.pageSize);
    }

    getMovimentacoesPaginadas(page: number, size: number): void {
        this.movimentacoesEstoqueFiltradas = this.movimentacoesEstoque.slice(page * size, (page + 1) * size);
    }

    criarNovaMovimentacao() {
        this.router.navigate(['/movimentacao-estoque-criar']);
    }

    getListaDeMovimentacoes(): void {
        this.isLoading = true;

        this.estoqueService.listarTodos()
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (res: MovimentacaoEstoqueResponseDTO[]) => {
                    if (res && res.length > 0) {
                        this.movimentacoesEstoque = res;
                        this.movimentacoesEstoqueFiltradas = [...res];

                        // Verifica se os dados carregaram corretamente
                        console.log("Movimentações carregadas:", this.movimentacoesEstoque);
                        console.log("Movimentacoes carregas 2 :", this.movimentacoesEstoqueFiltradas)
                    } else {
                        this.movimentacoesEstoque = [];
                        this.movimentacoesEstoqueFiltradas = [];
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Aviso',
                            detail: 'Nenhuma movimentação encontrada.',
                            life: 3000
                        });
                    }
                },
                error: (error: any) => {
                    console.error('Erro ao carregar movimentações', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao carregar a lista de movimentações.',
                        life: 5000
                    });
                }
            });
    }

    editarMovimentacao(id: string | undefined) {
        if (!id) {
            console.error("Erro: ID da movimentação está indefinido!");
            return;
        }

        this.router.navigate(['/movimentacao-estoque-editar', id]);
    }

    confirmarExclusao(movimentacao: MovimentacaoEstoqueResponseDTO) {
        this.movimentacaoSelecionada = movimentacao;
        this.modalExclusaoVisivel = true;
    }

    excluirMovimentacao() {
        if (!this.movimentacaoSelecionada) return;

        this.estoqueService.excluir(this.movimentacaoSelecionada.id).subscribe({
            next: () => {
                this.modalExclusaoVisivel = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Movimentação excluída com sucesso!'
                });

                this.getListaDeMovimentacoes();
            },
            error: () => {
                this.modalExclusaoVisivel = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao excluir movimentação!'
                });
            }
        });
    }
}

