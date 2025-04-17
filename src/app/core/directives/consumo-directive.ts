import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appKmLMask]' // Certifique-se de que o seletor corresponde ao nome usado no HTML
})
export class KmLMaskDirective {  // Nome da classe corrigido

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value: string = this.el.nativeElement.value;

    // Remove qualquer texto não numérico, exceto '.' e ','
    value = value.replace(/[^\d.,]/g, ''); // Apenas números, vírgula e ponto

    // Substitui ',' por '.' para normalizar entrada
    value = value.replace(',', '.');

    // Insere um ponto automaticamente após o segundo dígito se não houver
    if (value.length > 2 && !value.includes('.')) {
      value = value.substring(0, 2) + '.' + value.substring(2);
    }

    // Permite apenas um ponto ('.')
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1]; // Se houver mais de um '.', mantém só o primeiro
    }

    // Limita a dois dígitos após o ponto (decimal)
    if (parts[1]?.length > 2) {
      value = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    // Adiciona o sufixo " L" ao valor
    if (!value.includes(' L')) {
      value = value + ' L';
    }

    // Garante que o valor tenha no máximo 6 caracteres (com o " L" incluso)
    if (value.length > 6) {
      value = value.substring(0, 5) + ' L';
    }

    // Atualiza o valor no campo de input e no FormControl
    this.el.nativeElement.value = value;
    this.control.control?.setValue(value);
  }
}
