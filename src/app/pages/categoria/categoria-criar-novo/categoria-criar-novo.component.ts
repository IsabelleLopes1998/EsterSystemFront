import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { CategoriaService } from '../categoria.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CategoriaResponse } from '../categoria-listar/categoria.model';


@Component({
  selector: 'app-categoria-criar-novo',
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
    ProgressSpinnerModule, DialogModule ],
  templateUrl: './categoria-criar-novo.component.html',
  styleUrl: './categoria-criar-novo.component.css',
  providers: [MessageService]

})
export class CategoriaCriarNovoComponent {
  breadcrumbs = [
    { label: 'Início', url: '/' },
    { label: 'Categorias', url: '/categoria-listar' },
    { label: 'Nova Categoria', url: '/categoria-criar-novo' }
  ];

  categoriaForm: FormGroup;
  isFormValid: boolean = false;
  isLoading = false;
  isEditing = false;
  id: string | null = null;
  formAlterado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.categoriaForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.id = id;
      this.carregarCategoria(); // ← só se tiver esse método
    }

    this.categoriaForm.valueChanges.subscribe(() => {
      this.isFormValid = this.categoriaForm.valid;
    });
  }


  carregarCategoria(): void {
    if (!this.id) return;

    this.isLoading = true;
    this.categoriaService.getCategoriaPorId(this.id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          id: categoria.id,
          nome: categoria.nome,
          descricao: categoria.descricao
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar categoria.' });
      }
    });
  }

  salvarCategoria(): void {
    if (this.categoriaForm.invalid) return;

    const categoria: CategoriaResponse = this.categoriaForm.getRawValue();

    this.isLoading = true;

    if (this.isEditing) {
      this.categoriaService.atualizarCategoria(categoria).subscribe({
          next: () => {
            this.successAndRedirect('Categoria atualizada com sucesso!');
          },
          error: () => {
            this.isLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar!' });
          }
        });
    } else {
      this.categoriaService.salvarCategoria(categoria).subscribe({
        next: () => {
          this.successAndRedirect('Categoria cadastrada com sucesso!');
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar!' });
        }
      });
    }
  }

  private successAndRedirect(message: string): void {
    this.isLoading = false;
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
    setTimeout(() => this.router.navigate(['/categoria-listar']), 1500);
  }

  limparFormulario(): void {
    this.categoriaForm.reset();

    this.categoriaForm.patchValue({
        nome: '',
        descricao: ''
    });
  }
}
