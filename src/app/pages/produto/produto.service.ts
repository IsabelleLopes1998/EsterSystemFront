import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProdutoResponse, ProdutoRequest } from './produto-listar/produto.model';

export interface ProdutoResponseDTO {
    id: string;
    nome: string;
    valor: number;
    quantidadeEstoque: number;
    nomeCategoria: string;
    nomeSubcategoria?: string;
}

export interface ProdutoRequestDTO {
    nome: string;
    valor: number;
    quantidadeEstoque: number;
    idCategoria: string;
    idSubcategoria?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private produtoApiUrl = `${environment.apiBaseUrl}/produtos`;

  constructor(private http: HttpClient) { }

  salvarProduto(produto: ProdutoRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.post<ProdutoResponseDTO>(`${this.produtoApiUrl}/salvarProduto`, produto);
  }

  getListaDeProdutos(): Observable<ProdutoResponseDTO[]> {
    return this.http.get<ProdutoResponseDTO[]>(`${this.produtoApiUrl}/listaDeProdutos`);
  }

  getProdutoPorId(id: string): Observable<ProdutoResponseDTO> {
    return this.http.get<ProdutoResponseDTO>(`${this.produtoApiUrl}/${id}`);
  }

  atualizarProduto(produto: ProdutoRequestDTO, id: string): Observable<ProdutoResponseDTO> {
    return this.http.put<ProdutoResponseDTO>(`${this.produtoApiUrl}/${id}`, produto);
  }

  excluirProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.produtoApiUrl}/${id}`);
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.produtoApiUrl}/listaDeProdutos`);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.produtoApiUrl}/buscarPorId/${id}`);
  }

  criar(produto: any): Observable<any> {
    return this.http.post(`${this.produtoApiUrl}/salvarProduto`, produto);
  }

  atualizar(id: number, produto: any): Observable<any> {
    return this.http.put(`${this.produtoApiUrl}/atualizarProduto/${id}`, produto);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.produtoApiUrl}/excluirProduto/${id}`);
  }

  criarProduto(dto: ProdutoRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.post<ProdutoResponseDTO>(`${this.produtoApiUrl}/salvarProduto`, dto);
  }

  atualizarProdutoDTO(id: string, dto: ProdutoRequestDTO): Observable<ProdutoResponseDTO> {
    return this.http.put<ProdutoResponseDTO>(`${this.produtoApiUrl}/${id}`, dto);
  }

  excluirProdutoDTO(id: string): Observable<void> {
    return this.http.delete<void>(`${this.produtoApiUrl}/${id}`);
  }

  buscarProdutoPorId(id: string): Observable<ProdutoResponseDTO> {
    return this.http.get<ProdutoResponseDTO>(`${this.produtoApiUrl}/${id}`);
  }
}
