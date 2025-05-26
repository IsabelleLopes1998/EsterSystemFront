import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteResponse } from './cliente-listar/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteApiUrl = `${environment.apiBaseUrl}/clientes`;


  constructor(private http: HttpClient) { }



  salvarCliente(cliente: any): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.clienteApiUrl}/salvarCliente`, cliente);
  }

  getListaDeClientes(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(`${this.clienteApiUrl}/listaDeClientes`);
  }

  getClientePorId(id: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.clienteApiUrl}/buscarPorId/${id}`);
  }

  atualizarCliente(cliente: ClienteResponse): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.clienteApiUrl}/atualizarCliente/${cliente.id}`, cliente);
  }

  excluirCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.clienteApiUrl}/excluirCliente/${id}`);
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.clienteApiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.clienteApiUrl}/${id}`);
  }

  criar(cliente: any): Observable<any> {
    return this.http.post(this.clienteApiUrl, cliente);
  }

  atualizar(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.clienteApiUrl}/${id}`, cliente);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.clienteApiUrl}/${id}`);
  }

}

