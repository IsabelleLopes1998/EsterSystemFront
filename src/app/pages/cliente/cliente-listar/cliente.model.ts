export interface ClienteResponse {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string; // ✅ Altere para string (formato yyyy-MM-dd)
  email: string;
  primeiroTelefone: string;
  segundoTelefone: string;
  rua: string;
  numero: string;
  complemento: string;
  cep: string;
}

