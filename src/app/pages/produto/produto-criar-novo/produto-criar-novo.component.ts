import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProdutoService } from '../produto.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ProdutoResponse, ProdutoRequest } from '../produto-listar/produto.model';
import { CategoriaService } from '../../categoria/categoria.service';
import { SubcategoriaService } from '../../subcategoria/subcategoria.service';


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
    breadcrumbs: any = [{ "label": "Início", "url": "#" }, { "label": "Nova consulta", "url": "javascript:void(0)" }];

      produtoForm: FormGroup;
      isFormValid: boolean = false;
      isLoading = false;
      isEditing = false;
      id: string | null = null;
      formAlterado: boolean = false;

      categoria: { id: string; nome: string }[] = [];
      subcategoria: { id: string; nome: string }[] = [];


      constructor(
          private fb: FormBuilder,
          private route: ActivatedRoute,
          private router: Router,
          private produtoService: ProdutoService,
          private categoriaService: CategoriaService,
          private subCategoriaService: SubcategoriaService,
          private messageService: MessageService

      ) {
        this.produtoForm = this.fb.group({
          nome: ['', Validators.required],
          valor: [0,Validators.required],
          quantidadeEstoque: [0, Validators.required],
          idCategoria: [null, Validators.required],       // ← selecionado no dropdown
          idSubcategoria: [null]     // ← opcional
        });;
      }
      ngOnInit() {
        this.isFormValid = this.produtoForm.valid;
        this.formAlterado = false;

        // Primeiro carrega as opções do dropdown
        this.categoriaService.getListaDeCategorias().subscribe(cats => {
          this.categoria = cats;
          console.log('[DEBUG] Categorias carregadas:', this.categoria);

        });

        this.subCategoriaService. getListaDeSubcategorias().subscribe(subs => {
          this.subcategoria = subs;
        });

        // Depois verifica se está em modo edição
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEditing = true;
          this.id = id;
          this.carregarProduto(); // agora as categorias já estarão carregadas
        }

        // Atualiza estado de validade
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

          this.isLoading = true; // Exibe o spinner antes do envio

          // Captura TODOS os valores do formulário, incluindo os desabilitados
          const formValues = this.produtoForm.getRawValue();

          const produto: ProdutoRequest = {
            nome: this.produtoForm.getRawValue().nome || '',
            valor: this.produtoForm.getRawValue().valor || '',
            quantidadeEstoque: this.produtoForm.getRawValue().quantidadeEstoque || '',
            idCategoria: this.produtoForm.getRawValue().idCategoria || '',
            //idSubcategoria: this.produtoForm.getRawValue().idSubcategoria || null
            ...(formValues.idSubcategoria ? { idSubcategoria: formValues.idSubcategoria } : {})
          };

          console.log('Enviando para o backend:', produto); // Verifica se os valores estão corretos no console

          if (this.isEditing) {
            this.produtoService.atualizarProduto(produto, this.id!).subscribe({
              next: () => {
                this.isLoading = false;
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!' });
                setTimeout(() => this.router.navigate(['/produto-listar']), 2000);
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
                setTimeout(() => this.router.navigate(['/produto-listar']), 2000);
              },
              error: () => {
                this.isLoading = false;
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar o produto!' });
              }
            });
          }
        }

        categoriaSelecionada(event: any) {
            console.log('[DEBUG] Categoria selecionada:', event);
        }

        limparFormulario(): void {
              this.produtoForm.reset();

              this.produtoForm.patchValue({
                nome: '',
                valor: '',
                quantidadeEstoque: '',
                idCategoria: '',
                idSubCategoria: ''
              });
        }


}



