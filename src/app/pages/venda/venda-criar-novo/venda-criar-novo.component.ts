import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { VendaService } from '../venda.service';
import { VendaRequestDTO, FormaPagamento, VendaItemDTO } from '../venda.model';
import { ClienteService } from '../../cliente/cliente.service';
import { ProdutoService } from '../../produto/produto.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-venda-criar-novo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    ToastModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    AutoCompleteModule,
    TooltipModule,
    ProgressSpinnerModule,
    CalendarModule
  ],
  templateUrl: './venda-criar-novo.component.html',
  styleUrls: ['./venda-criar-novo.component.css'],
  providers: [MessageService]
})
export class VendaCriarNovoComponent implements OnInit {
  form: FormGroup;
  loading = false;
  id: string | null = null;
  formasPagamento = Object.values(FormaPagamento);
  vendaItems: VendaItemDTO[] = [];
  clientes: any[] = [];
  produtos: any[] = [];
  filteredProdutos: any[] = [];
  produtoSelecionado: any = null;
  quantidadeSelecionada: number = 1;
  breadcrumbs = [
    { label: 'Início', url: '/' },
    { label: 'Vendas', url: '/venda-listar' },
    { label: 'Nova Venda', url: '/venda-criar-novo' }
  ];

  constructor(
    private fb: FormBuilder,
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      data: [new Date(), Validators.required],
      idCliente: [null, Validators.required],
      formaPagamento: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
    
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.carregarVenda(this.id);
    }
  }

  carregarClientes(): void {
    this.clienteService.getListaDeClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar clientes'
        });
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.getListaDeProdutos().subscribe({
      next: (produtos) => {
        console.log('Produtos carregados:', produtos); // Debug log
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error); // Debug log
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar produtos'
        });
      }
    });
  }

  filtrarProdutos(event: any): void {
    console.log('Evento de filtro:', event); // Debug log
    const query = event.query.toLowerCase();
    this.filteredProdutos = this.produtos.filter(produto => 
      produto.nome.toLowerCase().includes(query)
    );
    console.log('Produtos filtrados:', this.filteredProdutos); // Debug log
  }

  onProdutoSelect(event: any): void {
    console.log('Produto selecionado no evento:', event); // Debug log
    this.produtoSelecionado = event.value; // Pegando apenas o objeto do produto
    // Resetar a quantidade para 1 quando um novo produto é selecionado
    this.quantidadeSelecionada = 1;
  }

  adicionarProduto(): void {
    console.log('Produto selecionado:', this.produtoSelecionado); // Debug log
    console.log('Quantidade selecionada:', this.quantidadeSelecionada); // Debug log

    // Verifica se o produto existe e tem um ID
    if (!this.produtoSelecionado || !this.produtoSelecionado.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione um produto válido'
      });
      return;
    }

    // Verifica se a quantidade é válida
    if (!this.quantidadeSelecionada || this.quantidadeSelecionada < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe uma quantidade válida'
      });
      return;
    }

    // Verifica se o produto já foi adicionado
    const produtoJaAdicionado = this.vendaItems.some(item => item.produtoId === this.produtoSelecionado.id);
    if (produtoJaAdicionado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Este produto já foi adicionado'
      });
      return;
    }

    // Adiciona o novo item com a quantidade selecionada
    this.vendaItems.push({
      produtoId: this.produtoSelecionado.id,
      quantidadeVenda: this.quantidadeSelecionada
    });

    // Limpa os campos
    this.produtoSelecionado = null;
    this.quantidadeSelecionada = 1;
    this.calcularTotal();
  }

  getProdutoNome(produtoId: string): string {
    const produto = this.produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : '';
  }

  calcularTotal(): void {
    let total = 0;
    for (const item of this.vendaItems) {
      const produto = this.produtos.find(p => p.id === item.produtoId);
      if (produto) {
        total += produto.preco * item.quantidadeVenda;
      }
    }
    console.log('Total calculado:', total); // Debug log
  }

  carregarVenda(id: string): void {
    this.loading = true;
    this.vendaService.buscarVenda(id).subscribe({
      next: (venda) => {
        // Converte a data string para objeto Date
        const dataVenda = new Date(venda.dataVenda);
        
        this.form.patchValue({
          data: dataVenda,
          idCliente: venda.idCliente,
          formaPagamento: venda.statusVenda // Usando statusVenda em vez de formaPagamento
        });
        
        // Carregar itens da venda
        this.vendaItems = venda.vendaItemList.map(item => ({
          produtoId: item.produtoId,
          quantidadeVenda: item.quantidadeVenda
        }));
        
        // Atualizar breadcrumb para edição
        this.breadcrumbs = [
          { label: 'Início', url: '/' },
          { label: 'Vendas', url: '/venda-listar' },
          { label: 'Editar Venda', url: `/venda-editar/${id}` }
        ];
        
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar venda'
        });
        this.loading = false;
        this.router.navigate(['/venda-listar']);
      }
    });
  }

  removerItem(index: number): void {
    this.vendaItems.splice(index, 1);
    this.calcularTotal();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    if (this.vendaItems.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Adicione pelo menos um produto à venda'
      });
      return;
    }

    this.loading = true;
    const formValues = this.form.value;
    
    // Formatação da data para o formato esperado pelo backend
    const data = formValues.data instanceof Date ? formValues.data : new Date(formValues.data);
    
    const venda: VendaRequestDTO = {
      data: data.toISOString(),
      idCliente: formValues.idCliente,
      formaPagamento: formValues.formaPagamento,
      vendaItemList: this.vendaItems
    };

    const operacao = this.id 
      ? this.vendaService.atualizarVenda(this.id, venda)
      : this.vendaService.criarVenda(venda);

    operacao.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.id ? 'Venda atualizada com sucesso' : 'Venda salva com sucesso'
        });
        this.router.navigate(['/venda-listar']);
      },
      error: (error) => {
        console.error('Erro ao salvar venda:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar venda'
        });
        this.loading = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/venda-listar']);
  }

  limparFormulario(): void {
    this.form.reset();
    this.loading = false;
  }
}