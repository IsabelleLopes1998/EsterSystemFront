import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MovimentacaoEstoqueRequestDTO {
    idProduto: string;
    data: Date;
    quantidade: number;
    observacao: string;
    tipoAcerto: string;
    idCompra?: string;
    idVenda?: string;
}

export interface MovimentacaoEstoqueResponseDTO {
    id: string;
    idProduto: string;
    produtoName: string;
    data: string;
    quantidade: number;
    observacao: string;
    tipoMovimentacao: string;
    idUsuario: string;
    idCompra?: string;
    idVenda?: string;
}

@Injectable({
    providedIn: 'root'
})
export class EstoqueService {
    private apiUrl = `${environment.apiBaseUrl}/movimentacao-estoque`;

    constructor(private http: HttpClient) { }

    listar(): Observable<MovimentacaoEstoqueResponseDTO[]> {
        return this.http.get<MovimentacaoEstoqueResponseDTO[]>(this.apiUrl);
    }

    criar(dto: MovimentacaoEstoqueRequestDTO): Observable<MovimentacaoEstoqueResponseDTO> {
        return this.http.post<MovimentacaoEstoqueResponseDTO>(this.apiUrl, dto);
    }

    excluir(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    buscarPorId(id: string): Observable<MovimentacaoEstoqueResponseDTO> {
        return this.http.get<MovimentacaoEstoqueResponseDTO>(`${this.apiUrl}/${id}`);
    }
}

