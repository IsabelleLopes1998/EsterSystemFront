import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCnpj',
  standalone: true
})
export class FormatCnpjPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    
    // Remove qualquer caractere que não seja número
    const cnpjLimpo = value.replace(/\D/g, '');

    // Aplica a máscara: 99.999.999/9999-99
    return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }
}