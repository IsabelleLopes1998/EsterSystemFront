import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subcategoria-criar-novo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    ToastModule
  ],
  templateUrl: './subcategoria-criar-novo.component.html',
  styleUrl: './subcategoria-criar-novo.component.css',
  providers: [MessageService]
})
export class SubcategoriaCriarNovoComponent {
  breadcrumbs = [
    { label: 'Início', url: '/' },
    { label: 'Subcategorias', url: '/subcategoria-listar' },
    { label: 'Nova Subcategoria', url: '/subcategoria-criar-novo' }
  ];

  subcategoriaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.subcategoriaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    });
  }
}
