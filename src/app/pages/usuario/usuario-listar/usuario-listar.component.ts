import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    PrimeNgModule,
    BreadcrumbModule,
    ToastModule,
    PaginatorModule,
    ProgressSpinnerModule
  ],
  templateUrl: './usuario-listar.component.html',
  styleUrls: ['./usuario-listar.component.css'],
  providers: [MessageService]
})
export class UsuarioListarComponent {
  @ViewChild(PaginatorModule) paginator: PaginatorModule;
  @Input() TITULO = 'Lista de usuários';

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  breadcrumbs = [
    { label: 'Início', url: '/index' },
    { label: 'Lista de usuários', url: '#/usuario-listar' }
  ];
  tiposPerfil = [
    { key: 1, label: 'Administrador' }
  ];

  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;
  first = 0;
  rows = 10;
  isLoading = true;
  pesquisar: string = '';

  modalExclusaoVisivel = false;
  usuarioSelecionado!: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getListaDeUsuarios();
  }

  getListaDeUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.listarTodos().subscribe({
      next: (res) => {
        this.usuarios = res;
        this.usuariosFiltrados = [...res];
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de usuários'
        });
        this.isLoading = false;
      }
    });
  }

  criarNovoUsuario() {
    this.router.navigate(['/usuario-criar-novo']);
  }

  editarUsuario(id: number | undefined) {
    if (!id) return;
    this.router.navigate(['/usuario-criar-novo', id]);
  }

  confirmarExclusao(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
    this.modalExclusaoVisivel = true;
  }

  // excluirUsuario() {
  //   if (!this.usuarioSelecionado?.id) return;

  //   this.usuarioService.excluir(this.usuarioSelecionado.id).subscribe({
  //     next: () => {
  //       this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário excluído com sucesso!' });
  //       this.getListaDeUsuarios();
  //       this.modalExclusaoVisivel = false;
  //     },
  //     error: () => {
  //       this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir usuário!' });
  //       this.modalExclusaoVisivel = false;
  //     }
  //   });
  // }
  getLabelPerfil(codigo: number): string {
    const perfil = this.tiposPerfil.find(p => p.key === codigo);
    return perfil ? perfil.label : 'Desconhecido';
  }
  formatarCpf(cpf: string): string {
    if (!cpf) return '';
    const apenasNumeros = cpf.replace(/\D/g, '');
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  filtrarUsuarios() {
    const pesquisa = this.pesquisar.toLowerCase();

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(pesquisa) ||
      usuario.email.toLowerCase().includes(pesquisa) ||
      String(usuario.perfil).toLowerCase().includes(pesquisa) ||
      usuario.cpf.toLowerCase().includes(pesquisa)
    );
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.getUsuariosPagina(this.pageIndex, this.pageSize);
  }

  getUsuariosPagina(page: number, size: number): void {
    this.usuariosFiltrados = this.usuarios.slice(page * size, (page + 1) * size);
  }
}
