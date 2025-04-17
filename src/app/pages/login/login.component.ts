import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeNgModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      cpf: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });

  }

  fazerLogin(): void {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos corretamente'
      });
      return;
    }

    const { cpf, senha } = this.loginForm.value;

    this.authService.login(cpf.replace(/\D/g, ''), senha).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token); // 👈 salva o token ANTES de redirecionar

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!'
        });

        console.log('Login OK, redirecionando...');
        this.router.navigateByUrl('/index'); // ou this.router.navigate(['/index']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'CPF ou senha inválidos'
        });
      }
    });

  }

}
