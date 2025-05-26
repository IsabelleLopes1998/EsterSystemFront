import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface AuthRequestDTO {
  username: string;
  senha: string;
}

interface AuthResponseDTO {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly TOKEN_KEY = 'token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if there's a token on startup
    const hasToken = !!localStorage.getItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(hasToken);
  }

  login(username: string, senha: string): Observable<AuthResponseDTO> {
    const loginData: AuthRequestDTO = {
      username: username,
      senha: senha
    };

    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    return `Bearer ${token}`;
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
