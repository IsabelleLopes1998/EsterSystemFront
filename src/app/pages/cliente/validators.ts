import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarCpf(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  let dig1 = resto >= 10 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  let dig2 = resto >= 10 ? 0 : resto;

  return dig1 === parseInt(cpf.charAt(9)) && dig2 === parseInt(cpf.charAt(10));
}

export function validarCnpj(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const peso2 = [6].concat(peso1);

  const calcularDigito = (base: string, pesos: number[]) => {
    const soma = base.split('').reduce((acc, val, i) => acc + parseInt(val) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const base = cnpj.slice(0, 12);
  const dig1 = calcularDigito(base, peso1);
  const dig2 = calcularDigito(base + dig1, peso2);

  return `${dig1}${dig2}` === cnpj.slice(12);
}

export function cpfOuCnpjValido(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value?.replace(/\D/g, '');

    if (!valor) return { cpfCnpjInvalido: true };

    if (valor.length === 11 && !validarCpf(valor)) return { cpfInvalido: true };
    if (valor.length === 14 && !validarCnpj(valor)) return { cnpjInvalido: true };
    if (valor.length !== 11 && valor.length !== 14) return { cpfCnpjInvalido: true };

    return null;
  };
}
