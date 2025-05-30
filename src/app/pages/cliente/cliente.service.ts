import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteResponse } from './cliente-listar/cliente.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly clienteApiUrl = `${environment.apiBaseUrl}/clientes`;

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
    return this.http.put<ClienteResponse>(
      `${this.clienteApiUrl}/atualizarCliente/${cliente.id}`,
      cliente
    );
  }


  excluirCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.clienteApiUrl}/excluirCliente/${id}`);
  }

  verificarCpf(cpf: string, id?: string): Observable<boolean> {
    const params = new HttpParams().set('cpf', cpf).set('id', id ?? '');
    return this.http.get<boolean>(`${this.clienteApiUrl}/clientes/exists-by-cpf`, { params });
  }


 verificarEmail(email: string, id?: string): Observable<boolean> {
   const params = new HttpParams()
     .set('email', email)
     .set('id', id ?? '');
   return this.http.get<boolean>(`${this.clienteApiUrl}/clientes/exists-by-email`, { params });
 }


}
