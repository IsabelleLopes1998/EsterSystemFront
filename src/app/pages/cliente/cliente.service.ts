import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClienteCNPJ } from './cliente-consultar-novo/clienteCNPJ.model';
import { Sintegra } from './cliente-consultar-novo/sintegra.model';
import { Cliente } from './cliente-listar/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private cnpjApiUrl = `${environment.apiBaseUrl}/someli/api/consultaCNPJ`;
  private sintegraApiUrl = `${environment.apiBaseUrl}/someli/api/sintegra`;
  private clienteApiUrl = `${environment.apiBaseUrl}/someli/cliente`;


  constructor(private http: HttpClient) { }

  consultarClientePorCNPJ(cnpj: string): Observable<ClienteCNPJ> {
    return this.http.get<ClienteCNPJ>(`${this.cnpjApiUrl}/${cnpj}`);
  }

  consultarSintegra(payload: any): Observable<Sintegra> {
    return this.http.post<Sintegra>(`${this.sintegraApiUrl}/consulta`, payload);
  }


  salvarCliente(cliente: any): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.clienteApiUrl}/salvarCliente`, cliente);
  }

  getListaDeClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.clienteApiUrl}/listarClientes`);
  }

  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.clienteApiUrl}/buscarPorId/${id}`);
  }

  atualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.clienteApiUrl}/atualizarCliente/${cliente.clienteId}`, cliente);
  }

  excluirCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.clienteApiUrl}/excluirCliente/${id}`);
  }

}

