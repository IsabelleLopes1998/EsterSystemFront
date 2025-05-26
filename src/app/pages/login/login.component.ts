import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PrimeNgModule, 
    ToastModule,
    InputMaskModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  mostrarSenha = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() { return this.form.get('username'); }
  get senha() { return this.form.get('senha'); }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fazerLogin() {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { username, senha } = this.form.value;

      this.authService.login(username, senha).subscribe({
        next: () => {
          this.router.navigate(['/index']);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.errorMessage = 'Usuário ou senha inválidos';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão com o servidor';
          } else {
            this.errorMessage = 'Erro ao fazer login. Tente novamente.';
          }
        }
      });
    }
  }
}
