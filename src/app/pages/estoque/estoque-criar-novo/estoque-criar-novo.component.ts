import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-usuario-criar-novo',
    standalone: true,
    imports: [CommonModule,
        ReactiveFormsModule,
        PrimeNgModule,
        BreadcrumbModule,
        InputMaskModule,
        DropdownModule,
        TreeSelectModule,
        ToastModule,
        OverlayPanelModule,
        ProgressSpinnerModule, DialogModule],
    templateUrl: './usuario-criar-novo.component.html',
    styleUrl: './usuario-criar-novo.component.css',
    providers: [MessageService]
})
export class UsuarioCriarNovoComponent {
    breadcrumbs: any = [
        { label: 'Início', url: '#' },
        { label: 'Lista de usuários', url: '/usuario-listar' },
        { label: 'Novo usuário', url: 'javascript:void(0)' }
    ];
    usuarioForm!: FormGroup;
    perfis = [
        { key: 1, label: 'Administrador' }
    ];

    isEditing = false;
    isLoading = false;
    perfilSelecionado: string;


    mostrarSenha = false;
    mostrarConfirmacao = false;
    senhasIguais: boolean | null = null;

    temMinCaracteres = false;
    temNumero = false;
    temMaiuscula = false;
    temMinuscula = false;
    temEspecial = false;



    constructor(
        private fb: FormBuilder,
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private route: ActivatedRoute

    ) {
        this.usuarioForm = this.fb.group({
            nome: ['', Validators.required],
            cpf: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            perfil: ['', Validators.required],
            senha: ['', Validators.required],
            confirmarSenha: ['', Validators.required],
        });

    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            // Edição
            this.usuarioService.buscarPorId(+id).subscribe(usuario => {
                this.usuarioForm.patchValue(usuario);
            });
        } else {
            // Criação
            this.usuarioForm.reset({ perfil: 'ADMINISTRADOR' });
        }
    }
    criarNovaMovimentacaoEstoque() {
        this.route.navigate(['/estoque-criar-novo'])
    }
    limparFormulario() {
        this.usuarioForm.reset({ perfil: 'ADMINISTRADOR' });
        this.isEditing = false;
    }
    salvarUsuario(): void {
        if (this.usuarioForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Campos obrigatórios',
                detail: 'Preencha todos os campos corretamente'
            });
            return;
        }

        const form = this.usuarioForm.value;

        const novoUsuario: Usuario = {
            nome: form.nome?.trim(),
            cpf: form.cpf?.replace(/\D/g, ''), // remove pontuação
            email: form.email?.trim().toLowerCase(),
            perfil: form.perfil?.key ?? form.perfil, // <-- aqui é o mais importante!
            senha: form.senha
        };

        this.usuarioService.salvar(novoUsuario).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Usuário cadastrado',
                    detail: 'Usuário salvo com sucesso!'
                });
                this.usuarioForm.reset({ perfil: 1 }); // reset com perfil padrão
            },
            error: err => {
                console.error('Erro ao salvar usuário', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao salvar',
                    detail: 'Não foi possível cadastrar o usuário'
                });
            }
        });
    }


    applyCpfMask(value: string) {
        if (!value) return;

        let cpf = value.replace(/\D/g, ''); // Remove tudo que não for dígito

        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Limita a 11 dígitos
        }

        // Aplica a máscara manualmente
        if (cpf.length <= 3) {
            this.usuarioForm.get('cpf')?.setValue(cpf);
        } else if (cpf.length <= 6) {
            this.usuarioForm.get('cpf')?.setValue(`${cpf.slice(0, 3)}.${cpf.slice(3)}`);
        } else if (cpf.length <= 9) {
            this.usuarioForm.get('cpf')?.setValue(`${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`);
        } else {
            this.usuarioForm.get('cpf')?.setValue(`${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`);
        }
    }

    validarSenha(event: any) {
        // Impede espaço
        const senhaDigitada = event.target.value.replace(/\s/g, '');
        this.usuarioForm.get('senha')?.setValue(senhaDigitada, { emitEvent: false });

        const senha = senhaDigitada;

        this.temMinCaracteres = senha.length >= 8;
        this.temNumero = /\d/.test(senha);
        this.temMaiuscula = /[A-Z]/.test(senha);
        this.temMinuscula = /[a-z]/.test(senha);
        this.temEspecial = /[\W_]/.test(senha);

        const requisitos = [
            this.temNumero,
            this.temMaiuscula,
            this.temMinuscula,
            this.temEspecial
        ].filter(Boolean).length;

        this.verificarConfirmacao();
    }


    verificarConfirmacao() {
        const senha = this.usuarioForm.get('senha')?.value;
        const confirmar = this.usuarioForm.get('confirmarSenha')?.value;

        this.senhasIguais = senha && confirmar && senha === confirmar;
    }

}
