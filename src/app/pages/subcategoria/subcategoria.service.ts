import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubcategoriaRequest, SubcategoriaResponse } from './subcategoria-listar/subcategoria.model'; // ajuste o caminho conforme sua estrutura

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {

  private subcategoriaApiUrl = `${environment.apiBaseUrl}/subcategorias`;

  constructor(private http: HttpClient) {}

  salvarSubcategoria(sub: SubcategoriaRequest): Observable<SubcategoriaResponse> {
    return this.http.post<SubcategoriaResponse>(`${this.subcategoriaApiUrl}/salvarSubcategoria`, sub);
  }

  getListaDeSubcategorias(): Observable<SubcategoriaResponse[]> {
    return this.http.get<SubcategoriaResponse[]>(`${this.subcategoriaApiUrl}/listaDeSubcategorias`);
  }

  getSubcategoriaPorId(id: string): Observable<SubcategoriaResponse> {
    return this.http.get<SubcategoriaResponse>(`${this.subcategoriaApiUrl}/buscarPorId/${id}`);
  }

  atualizarSubcategoria(sub: SubcategoriaRequest, id: string): Observable<SubcategoriaResponse> {
    return this.http.put<SubcategoriaResponse>(`${this.subcategoriaApiUrl}/atualizarSubcategoria/${id}`, sub);
  }

  excluirSubcategoria(id: string): Observable<void> {
    return this.http.delete<void>(`${this.subcategoriaApiUrl}/excluirSubcategoria/${id}`);
  }
}
