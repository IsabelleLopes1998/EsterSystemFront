import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompraRequest, CompraResponse } from './compra-listar/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private compraApiUrl = `${environment.apiBaseUrl}/compras`;
  fb: any;
  itens: any;

  constructor(private http: HttpClient) { }

  salvarCompra(compra: CompraRequest): Observable<CompraResponse> {
    return this.http.post<CompraResponse>(`${this.compraApiUrl}`, compra);
  }

  getListaDeCompras(): Observable<CompraResponse[]> {
    return this.http.get<CompraResponse[]>(`${this.compraApiUrl}`);
  }
  
}