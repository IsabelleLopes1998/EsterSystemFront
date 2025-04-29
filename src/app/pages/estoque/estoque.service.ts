import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovimentacaoEstoqueRequestDTO, MovimentacaoEstoqueResponseDTO } from './estoque.model';

@Injectable({
    providedIn: 'root'
})
export class EstoqueService {
    private estoqueApiUrl = `${environment.apiBaseUrl}/movimentacao-estoque`;

    constructor(private http: HttpClient) { }

    salvar(movimentacaoEstoque: MovimentacaoEstoqueRequestDTO): Observable<MovimentacaoEstoqueResponseDTO> {
        return this.http.post<MovimentacaoEstoqueResponseDTO>(this.estoqueApiUrl, movimentacaoEstoque);
    }

    buscarPorId(id: string): Observable<MovimentacaoEstoqueResponseDTO> {
        return this.http.get<MovimentacaoEstoqueResponseDTO>(`${this.estoqueApiUrl}/${id}`);
    }


    listarTodos() {
        return this.http.get<MovimentacaoEstoqueResponseDTO[]>(`${this.estoqueApiUrl}`);
    }
    excluir(id: string): Observable<void> {
        return this.http.delete<void>(`${this.estoqueApiUrl}/${id}`)
    }
}

