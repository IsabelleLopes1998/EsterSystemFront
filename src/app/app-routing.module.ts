import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { ClienteListarComponent } from './pages/cliente/cliente-listar/cliente-listar.component';
import { ClienteCriarNovoComponent } from './pages/cliente/cliente-criar-novo/cliente-criar-novo.component';
import { ProdutoListarComponent } from './pages/produto/produto-listar/produto-listar.component';
import { ProdutoCriarNovoComponent } from './pages/produto/produto-criar-novo/produto-criar-novo.component';
import { CategoriaListarComponent } from './pages/categoria/categoria-listar/categoria-listar.component';
import { CategoriaCriarNovoComponent } from './pages/categoria/categoria-criar-novo/categoria-criar-novo.component';
import { EstoqueListarComponent } from './pages/estoque/estoque-listar/estoque-listar.component';
import { CompraListarComponent } from './pages/compra/compra-listar/compra-listar.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';

import { EstoqueListarComponent } from './pages/estoque/estoque-listar/estoque-listar.component';
import { EstoqueCriarNovoComponent } from './pages/estoque/estoque-criar-novo/estoque-criar-novo.component';
import { VendaListarComponent } from './pages/venda/venda-listar/venda-listar.component';
import { VendaCriarNovoComponent } from './pages/venda/venda-criar-novo/venda-criar-novo.component';

const routes: Routes = [
  // Rota de login (pública)
  { path: 'login', component: LoginComponent },

  // Rotas protegidas
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'index', component: IndexComponent },
      { path: 'cliente-criar-novo', component: ClienteCriarNovoComponent },
      { path: 'cliente-criar-novo/:id', component: ClienteCriarNovoComponent },
      { path: 'cliente-listar', component: ClienteListarComponent },
      { path: 'produto-listar', component: ProdutoListarComponent },
      { path: 'produto-criar-novo/:id', component: ProdutoCriarNovoComponent },
      { path: 'categoria-listar', component: CategoriaListarComponent },
      { path: 'categoria-criar-novo', component: CategoriaCriarNovoComponent },
      { path: 'produto-criar-novo', component: ProdutoCriarNovoComponent },
      { path: 'categoria-criar-novo/:id', component: CategoriaCriarNovoComponent },
      { path: 'estoque-listar', component: EstoqueListarComponent },
      { path: 'estoque-criar-novo', component: EstoqueCriarNovoComponent },
      { path: 'venda-listar', component: VendaListarComponent },
      { path: 'venda-criar-novo', component: VendaCriarNovoComponent },
      { path: 'venda-criar-novo/:id', component: VendaCriarNovoComponent }
    ]
  },

  // Redirecionamentos
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
