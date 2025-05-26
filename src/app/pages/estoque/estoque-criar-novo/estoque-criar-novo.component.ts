import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EstoqueService, MovimentacaoEstoqueRequestDTO } from '../estoque.service';
import { ProdutoService, ProdutoResponseDTO } from '../../produto/produto.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-estoque-criar-novo',
    standalone: true,
    imports: [
        CommonModule,
        PrimeNgModule,
        BreadcrumbModule,
        ToastModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ProgressSpinnerModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        InputTextareaModule,
        ButtonModule,
        AutoCompleteModule,
        TooltipModule
    ],
    templateUrl: './estoque-criar-novo.component.html',
    styleUrls: ['./estoque-criar-novo.component.css'],
    providers: [MessageService]
})
export class EstoqueCriarNovoComponent implements OnInit {
    form: FormGroup;
    isLoading = false;
    produtos: ProdutoResponseDTO[] = [];
    filteredProdutos: ProdutoResponseDTO[] = [];
    produtoSelecionado: ProdutoResponseDTO | null = null;
    tiposMovimentacao = [
        { label: 'Entrada Manual', value: 'ENTRADA_MANUAL' },
        { label: 'Saída Manual', value: 'SAIDA_MANUAL' }
    ];
    loading = false;
    breadcrumbs = [
        { label: 'Início', url: '/' },
        { label: 'Estoque', url: '/estoque-listar' },
        { label: 'Nova Movimentação', url: '/estoque-criar-novo' }
    ];

    constructor(
        private fb: FormBuilder,
        private estoqueService: EstoqueService,
        private produtoService: ProdutoService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            idProduto: [null, Validators.required],
            tipoAcerto: ['ENTRADA_MANUAL', Validators.required],
            data: [new Date(), Validators.required],
            quantidade: [1, Validators.required],
            observacao: ['']
        });
    }

    ngOnInit(): void {
        this.carregarProdutos();
    }

    carregarProdutos(): void {
        this.isLoading = true;
        this.produtoService.getListaDeProdutos().subscribe({
            next: (produtos) => {
                console.log('Produtos carregados:', produtos);
                this.produtos = produtos;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar produtos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar produtos'
                });
                this.isLoading = false;
            }
        });
    }

    filtrarProdutos(event: any): void {
        console.log('Evento de filtro:', event);
        const query = event.query.toLowerCase();
        this.filteredProdutos = this.produtos.filter(produto => 
            produto.nome.toLowerCase().includes(query)
        );
        console.log('Produtos filtrados:', this.filteredProdutos);
    }

    onProdutoSelect(event: any): void {
        console.log('Produto selecionado no evento:', event);
        this.produtoSelecionado = event.value;
        this.form.patchValue({
            idProduto: event.value.id
        });
    }

    salvar(): void {
        if (this.form.valid) {
            this.loading = true;
            this.isLoading = true;
            const dto: MovimentacaoEstoqueRequestDTO = this.form.value;
            
            this.estoqueService.criar(dto).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Movimentação de estoque registrada com sucesso'
                    });
                    this.router.navigate(['/estoque-listar']);
                },
                error: (error) => {
                    console.error('Erro ao salvar movimentação:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao registrar movimentação de estoque'
                    });
                    this.loading = false;
                    this.isLoading = false;
                }
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios'
            });
        }
    }

    limparFormulario(): void {
        this.form.reset({
            tipoAcerto: 'ENTRADA_MANUAL',
            quantidade: 1,
            data: new Date()
        });
        this.produtoSelecionado = null;
    }
}
