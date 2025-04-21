import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriaResponse } from './categoria-listar/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private categoriaApiUrl = `${environment.apiBaseUrl}/categorias`;


  constructor(private http: HttpClient) { }



  salvarCategoria(categoria: any): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(`${this.categoriaApiUrl}/salvarCategoria`, categoria);
  }

  getListaDeCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(`${this.categoriaApiUrl}/listaDeCategoria`);
  }

  getCategoriaPorId(id: string): Observable<CategoriaResponse> {
    return this.http.get<CategoriaResponse>(`${this.categoriaApiUrl}/buscarPorId/${id}`);
  }

  atualizarCategoria(categoria: CategoriaResponse): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.categoriaApiUrl}/atualizarCategoria/${categoria.id}`, categoria);
  }

  excluirCategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${this.categoriaApiUrl}/excluirCategoria/${id}`);
  }

}

