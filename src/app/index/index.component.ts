import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';  // Importando o CardModule
import { ButtonModule } from 'primeng/button';  // Importando o ButtonModule
import { CommonModule } from '@angular/common';  // Importando o CommonModule para usar diretivas
import { Router } from '@angular/router';
// import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],  // Adicionando ButtonModule aqui
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  constructor(private router: Router) { }


  navigateTo(path: string) {
    this.router.navigate([path]);
  }


  saudacao: string = '';
  nomeUsuario: string = 'Usuário'; // Substituir com a lógica para obter o nome real do usuário

  ngOnInit() {
    this.definirSaudacao();
    // this.setNomeUsuario();   // Pega o nome do usuário logado
  }

  definirSaudacao() {
    const horas = new Date().getHours();
    if (horas < 12) {
      this.saudacao = 'Bom dia';
    } else if (horas >= 12 && horas < 18) {
      this.saudacao = 'Boa tarde';
    } else {
      this.saudacao = 'Boa noite';
    }
  }

  obterNomeUsuario() {
    // Implementar a lógica para obter o nome do usuário logado
    this.nomeUsuario = 'João'; // Exemplo
  }

  // setNomeUsuario() {
  //   const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
  //   if (tokenParsed) {
  //     // Use 'given_name' ou 'name' para pegar o nome do usuário logado
  //     this.nomeUsuario = tokenParsed['given_name'] || tokenParsed['name'];
  //   }
  // }

}
