export interface ClienteResponse {
  id: string;
  nome: string;
  cpf: string;
  dateBirth: string; // ✅ Altere para string (formato yyyy-MM-dd)
  email: string;
  rua: string;
  numero: string;
  complemento: string;
  cep: string;
}

