export interface ClienteCNPJ {
  status: string;
  ultimaAtualizacao: string;
  cnpj: string;
  tipo: string;
  porte: string;
  nome: string;
  fantasia: string;
  abertura: string;
  atividadePrincipal: { codigo: string; texto: string }[];
  atividadesSecundarias: { codigo: string; texto: string }[];
  naturezaJuridica: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  efr: string;
  situacao: string;
  dataSituacao: string;
  motivoSituacao: string;
  situacaoEspecial: string;
  dataSituacaoEspecial: string;
  capitalSocial: string;
  qsa: { nome: string; qual: string }[];
  simples: { opcao: boolean; dataOpcao: string; dataExclusao: string };
  simei: { opcao: boolean };
  billing: { free: boolean; database: boolean };
}

