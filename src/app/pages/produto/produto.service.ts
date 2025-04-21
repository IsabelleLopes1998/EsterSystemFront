import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProdutoResponse, ProdutoRequest } from './produto-listar/produto.model';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtoApiUrl = `${environment.apiBaseUrl}/produtos`;

  constructor(private http: HttpClient) { }

  salvarProduto(produto: ProdutoRequest): Observable<ProdutoResponse> {
    return this.http.post<ProdutoResponse>(`${this.produtoApiUrl}/salvarProduto`, produto);
  }

  getListaDeProdutos(): Observable<ProdutoResponse[]> {
    return this.http.get<ProdutoResponse[]>(`${this.produtoApiUrl}/listaDeProdutos`);
  }

  getProdutoPorId(id: string): Observable<ProdutoResponse> {
    return this.http.get<ProdutoResponse>(`${this.produtoApiUrl}/buscarPorId/${id}`);
  }

  atualizarProduto(produto: ProdutoRequest, id: string): Observable<ProdutoResponse> {
    return this.http.put<ProdutoResponse>(`${this.produtoApiUrl}/atualizarProduto/${id}`, produto);
  }

  excluirProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.produtoApiUrl}/excluirProduto/${id}`);
  }
}
