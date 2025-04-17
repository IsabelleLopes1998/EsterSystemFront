// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { OrgaoLocalDTO } from './orgaoLocalDTO.model';
// import { environment } from 'src/environments/environment';
// import { OrgaoLocalFilhoDTO } from './orgaoLocalFilhoDTO';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrgaoLocalService {
//   private baseUrl = `${environment.apiBaseUrl}/orgaoLocal`;; // Substitua pelo seu URL base
//   constructor(private http: HttpClient) { }

//   obterOrgaosLocaisAtivos(): Observable<OrgaoLocalDTO[]> {
//     return this.http.get<OrgaoLocalDTO[]>(`${this.baseUrl}/listarLotacao`);
//   }


//   obterSublotacao(id:number): Observable<OrgaoLocalFilhoDTO[]> {
//     return this.http.get<OrgaoLocalFilhoDTO[]>(`${this.baseUrl}/listarOrgaosLocaisPorId/`+id);
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrgaoLocalDTO } from './orgaoLocalDTO.model';
import { environment } from 'src/environments/environment';
import { OrgaoLocalFilhoDTO } from './orgaoLocalFilhoDTO';

@Injectable({
  providedIn: 'root'
})
export class OrgaoLocalService {
  private baseUrl = `${environment.apiBaseUrl}/orgaoLocal`; // Substitua pelo seu URL base

  constructor(private http: HttpClient) { }

  obterOrgaosLocaisAtivos(): Observable<OrgaoLocalDTO[]> {
    return this.http.get<OrgaoLocalDTO[]>(`${this.baseUrl}/listarLotacao`);
  }



  listarLotacaoAtiva(): Observable<any[]> {
    return this.http.get<OrgaoLocalDTO[]>(`${this.baseUrl}/orgaosLocaisAtivos`);
  }

  
  obterSublotacao(id: number): Observable<OrgaoLocalFilhoDTO[]> {
    if (isNaN(id) || id <= 0) {
      throw new Error('O parâmetro id deve ser um número válido.');
    }
    return this.http.get<OrgaoLocalFilhoDTO[]>(`${this.baseUrl}/listarOrgaosLocaisPorId/${id}`);
  }
}
