import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VendaRequestDTO, VendaItemDTO } from './venda.model';

export enum StatusVenda {
  PENDENTE = 'PENDENTE',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export interface VendaResponseDTO {
  id: string;
  idPagamento: string;
  usernameUsuario: string;
  idCliente: string;
  dataVenda: string;
  vendaItemList: VendaItemDTO[];
  valorTotal: number;
  statusVenda: StatusVenda;
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private apiUrl = `${environment.apiBaseUrl}/vendas`;

  constructor(private http: HttpClient) { }

  criarVenda(venda: VendaRequestDTO): Observable<VendaResponseDTO> {
    return this.http.post<VendaResponseDTO>(this.apiUrl, venda);
  }

  buscarVenda(id: string): Observable<VendaResponseDTO> {
    return this.http.get<VendaResponseDTO>(`${this.apiUrl}/${id}`);
  }

  listarVendas(): Observable<VendaResponseDTO[]> {
    return this.http.get<VendaResponseDTO[]>(this.apiUrl);
  }

  atualizarVenda(id: string, venda: VendaRequestDTO): Observable<VendaResponseDTO> {
    return this.http.put<VendaResponseDTO>(`${this.apiUrl}/${id}`, venda);
  }
} 