import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from './usuario.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private usuarioApiUrl = `${environment.apiBaseUrl}/api/usuarios`;

    constructor(private http: HttpClient) { }

    salvar(usuario: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(this.usuarioApiUrl, usuario);
    }

    buscarPorId(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.usuarioApiUrl}/${id}`);
    }


    listarTodos() {
        return this.http.get<Usuario[]>(`${this.usuarioApiUrl}`);
    }

}
export { Usuario };

