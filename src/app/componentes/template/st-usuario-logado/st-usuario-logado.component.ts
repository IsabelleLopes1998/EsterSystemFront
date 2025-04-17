// import { Component } from '@angular/core';
// import { DynamicDialogRef } from 'primeng/dynamicdialog';
// import { KeycloakService } from 'keycloak-angular';


// @Component({
//   selector: 'app-st-usuario-logado',
//   templateUrl: './st-usuario-logado.component.html',
//   styleUrls: ['./st-usuario-logado.component.css'],
// })
// export class StUsuarioLogadoComponent {
//   usuarioLogado: string = '';
//   emailUsuario: string = '';
//   firstName: string = '';

//   constructor(private keycloakService: KeycloakService, private ref: DynamicDialogRef) {}

//   ngOnInit() {
//     this.carregarDadosUsuario();
//   }

//   carregarDadosUsuario() {
//     const tokenParsed = this.keycloakService.getKeycloakInstance().tokenParsed;
  
//     if (tokenParsed) {
//       this.usuarioLogado = tokenParsed['preferred_username'] || tokenParsed['username'];
//       this.emailUsuario = tokenParsed['email'];
//       this.firstName = tokenParsed['given_name'] || tokenParsed['name'];
//     }
//   }
  

//   closeModal() {
//     this.ref.close();
//   }
// }