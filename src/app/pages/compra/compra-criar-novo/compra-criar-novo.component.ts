import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CompraService } from '../compra.service';
import { CompraRequest } from '../compra-listar/compra.model';

@Component({
  selector: 'app-compra-criar-novo',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    ProgressSpinnerModule
  ],
  templateUrl: './compra-criar-novo.component.html',
  styleUrls: ['./compra-criar-novo.component.css']
})
export class CompraCriarNovoComponent {
  form!: FormGroup;
  isLoading = false;
  produtos: any[] = []; // você pode carregar da API se desejar

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      data: ['', Validators.required],
      fornecedor: ['', Validators.required],
      itens: this.fb.array([])
    });

    this.adicionarItem(); // começa com 1 item por padrão
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem(): void {
    const itemForm = this.fb.group({
      produtoId: [null, Validators.required],
      valorUnitario: [0, Validators.required],
      quantidade: [1, Validators.required]
    });

    this.itens.push(itemForm);
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios.'
      });
      return;
    }

    this.isLoading = true;
    const compra: CompraRequest = {
      data: this.form.value.data,
      fornecedor: this.form.value.fornecedor,
      itens: this.form.value.itens
    };

    this.compraService.salvarCompra(compra).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Compra cadastrada com sucesso!'
        });
        this.router.navigate(['/compra-listar']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cadastrar compra.'
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}