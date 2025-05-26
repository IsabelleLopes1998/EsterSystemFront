import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { VendaService, VendaResponseDTO } from '../pages/venda/venda.service';

@Component({
    selector: 'app-index',
    standalone: true,
    imports: [
        CommonModule,
        PrimeNgModule,
        BreadcrumbModule,
        ToastModule,
        TableModule
    ],
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css'],
    providers: [MessageService]
})
export class IndexComponent implements OnInit {
    ultimasVendas: VendaResponseDTO[] = [];
    loading = false;
    totalVendas = 0;
    valorTotalVendas = 0;
    saudacao: string = '';
    nomeUsuario: string = 'Usuário';

    constructor(
        private vendaService: VendaService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.definirSaudacao();
        this.carregarUltimasVendas();
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

    carregarUltimasVendas(): void {
        this.loading = true;
        this.vendaService.listarVendas().subscribe({
            next: (vendas) => {
                console.log('Vendas carregadas:', vendas);
                this.ultimasVendas = vendas.slice(0, 5);
                this.totalVendas = vendas.length;
                this.valorTotalVendas = vendas.reduce((total, venda) => total + venda.valorTotal, 0);
                this.loading = false;
            },
            error: (error) => {
                console.error('Erro ao carregar vendas:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar vendas'
                });
                this.loading = false;
            }
        });
    }

    verTodasVendas(): void {
        this.router.navigate(['/venda-listar']);
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }
}
