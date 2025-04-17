import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private searchData: any[] = [];

  setSearchData(data: any[]): void {
    this.searchData = data;
  }

  getSearchData(): Observable<any[]> {
    return of(this.searchData);
  }
}