import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProdutoService, ProdutoRequestDTO } from '../produto.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CategoriaService } from '../../categoria/categoria.service';



@Component({
   selector: 'app-produto-criar-novo',
   standalone: true,
   imports: [CommonModule,
   ReactiveFormsModule,
   PrimeNgModule,
   BreadcrumbModule,
   InputMaskModule,
   DropdownModule,
   TreeSelectModule,
   ToastModule,
   OverlayPanelModule,
   ProgressSpinnerModule,
   ],
   templateUrl: './produto-criar-novo.component.html',
   styleUrl: './produto-criar-novo.component.css',
   providers: [MessageService]
})

export class ProdutoCriarNovoComponent {
    breadcrumbs: any = [{ "label": "Início", "url": "/index" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];

    produtoForm: FormGroup;
    isFormValid: boolean = false;
    isLoading = false;
    isEditing = false;
    id: string | null = null;
    formAlterado: boolean = false;

    categoria: { id: string; nome: string }[] = [];
    subcategoria: { id: string; nome: string }[] = [];
    voltarParaCompra = false;

    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private produtoService: ProdutoService,
      private categoriaService: CategoriaService,
      private messageService: MessageService
    ) {
      this.produtoForm = this.fb.group({
        nome: ['', Validators.required],
        valor: [0, Validators.required],
        quantidadeEstoque: [0, Validators.required],
        idCategoria: [null, Validators.required],
        idSubcategoria: [null]
      });

      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.voltarParaCompra = navigation.extras.state['voltarParaCompra'] === true;
        sessionStorage.setItem('voltarParaCompra', JSON.stringify(this.voltarParaCompra));
      } else {
        // fallback caso recarregue a página
        this.voltarParaCompra = JSON.parse(sessionStorage.getItem('voltarParaCompra') || 'false');
      }
    }



    ngOnInit() {
        this.isFormValid = this.produtoForm.valid;
        this.formAlterado = false;

        this.categoriaService.getListaDeCategorias().subscribe(cats => {
            this.categoria = cats;
            console.log('[DEBUG] Categorias carregadas:', this.categoria);
        });



        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditing = true;
            this.id = id;
            this.carregarProduto();
        }

        this.produtoForm.valueChanges.subscribe(() => {
            this.isFormValid = this.produtoForm.valid;
        });
    }

    carregarProduto() {
        if (!this.id) return;

        this.isLoading = true;
        this.produtoService.getProdutoPorId(this.id).subscribe({
            next: (produto) => {
                const categoriaSelecionada = this.categoria.find(cat => cat.nome === produto.nomeCategoria);
                const subcategoriaSelecionada = this.subcategoria.find(sub => sub.nome === produto.nomeSubcategoria);

                this.produtoForm.patchValue({
                    nome: produto.nome,
                    valor: produto.valor,
                    quantidadeEstoque: produto.quantidadeEstoque,
                    idCategoria: categoriaSelecionada?.id,
                    idSubcategoria: subcategoriaSelecionada?.id || ''
                });

                this.isLoading = false;
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar produto.' });
                this.isLoading = false;
            }
        });
    }

    salvarProduto() {

         console.log('[DEBUG] salvarProduto foi chamado');
        if (this.produtoForm.invalid) {
            console.log('[DEBUG] Formulário inválido');

            Object.keys(this.produtoForm.controls).forEach(key => {
                const control = this.produtoForm.get(key);
                if (control && control.invalid) {
                    console.log(`[DEBUG] Campo inválido: ${key}`, control.errors);
                }
            });

            return;
        }

        this.isLoading = true;

        const formValues = this.produtoForm.getRawValue();

        const produto: ProdutoRequestDTO = {
            nome: formValues.nome,
            valor: formValues.valor,
            quantidadeEstoque: formValues.quantidadeEstoque,
            idCategoria: formValues.idCategoria,
            ...(formValues.idSubcategoria ? { idSubcategoria: formValues.idSubcategoria } : {})
        };

        console.log('Enviando para o backend:', produto);

          const redirecionar = () => {
            const rota = this.voltarParaCompra ? '/compra-criar-novo' : '/produto-listar';
            setTimeout(() => this.router.navigate([rota]), 2000);
          };

        if (this.isEditing) {
          this.produtoService.atualizarProduto(produto, this.id!).subscribe({
            next: () => {
              this.isLoading = false;
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!' });

              setTimeout(() => {
                if (this.voltarParaCompra) {
                  sessionStorage.removeItem('voltarParaCompra');
                  this.router.navigate(['/compra-criar-novo']);
                } else {
                  this.router.navigate(['/produto-listar']);
                }
              }, 2000);
            },
            error: () => {
              this.isLoading = false;
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar o produto!' });
            }
          });
        } else {
          this.produtoService.salvarProduto(produto).subscribe({
            next: () => {
              this.isLoading = false;
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto cadastrado com sucesso!' });

              setTimeout(() => {
                if (this.voltarParaCompra) {
                  sessionStorage.removeItem('voltarParaCompra');
                  this.router.navigate(['/compra-criar-novo']);
                } else {
                  this.router.navigate(['/produto-listar']);
                }
              }, 2000);
            },
            error: () => {
              this.isLoading = false;
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar o produto!' });
            }
          });
        }

    }

    limparFormulario(): void {
        this.produtoForm.reset();
        this.produtoForm.patchValue({
            nome: '',
            valor: '',
            quantidadeEstoque: '',
            idCategoria: '',
            idSubcategoria: ''
        });
    }

    categoriaSelecionada(event: any) {
        console.log('[DEBUG] Categoria selecionada:', event);
    }
}



