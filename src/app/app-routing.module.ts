import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { ClienteListarComponent } from './pages/cliente/cliente-listar/cliente-listar.component';
import { ClienteCriarNovoComponent } from './pages/cliente/cliente-criar-novo/cliente-criar-novo.component';

import { ProdutoListarComponent } from './pages/produto/produto-listar/produto-listar.component';
import { ProdutoCriarNovoComponent } from './pages/produto/produto-criar-novo/produto-criar-novo.component';

import { CategoriaListarComponent } from './pages/categoria/categoria-listar/categoria-listar.component';
import { CategoriaCriarNovoComponent } from './pages/categoria/categoria-criar-novo/categoria-criar-novo.component';

import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';




const routes: Routes = [
  // Redirecionamento automático para /login ao abrir a aplicação
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    children: [
      { path: 'index', component: IndexComponent },
//       {
//         path: 'index',
//         loadComponent: () => import('../app/index/index.component').then(m => m.IndexComponent),
//         canActivate: [AuthGuard]
//       },

      { path: 'cliente-criar-novo', component: ClienteCriarNovoComponent },
      { path: 'cliente-criar-novo/:id', component: ClienteCriarNovoComponent },
      { path: 'cliente-listar', component: ClienteListarComponent },
      { path: 'produto-listar', component: ProdutoListarComponent },
      { path: 'produto-criar-novo/:id', component: ProdutoCriarNovoComponent },
      { path: 'categoria-listar', component: CategoriaListarComponent },
      { path: 'categoria-criar-novo', component: CategoriaCriarNovoComponent },
      { path: 'produto-criar-novo', component: ProdutoCriarNovoComponent },
      { path: 'categoria-criar-novo/:id', component: CategoriaCriarNovoComponent },

//       { path: 'financeiro', component: FinanceiroComponent, canActivate: [AuthGuard] },
//       { path: 'usuario-criar-novo', component: UsuarioCriarNovoComponent, canActivate: [AuthGuard] },
//       { path: 'usuario-criar-novo/:id', component: UsuarioCriarNovoComponent, canActivate: [AuthGuard] },
//       { path: 'usuario-listar', component: UsuarioListarComponent, canActivate: [AuthGuard] }
    ]
  },

  // Caso a rota não exista, redireciona para login
  { path: '**', redirectTo: 'index' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
