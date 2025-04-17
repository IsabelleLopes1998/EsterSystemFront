export interface Sintegra {
    code: number;
    codeMessage: string;
    header: {
      apiVersion: string;
      service: string;
      parameters: { [key: string]: string };
      clientName: string;
      tokenName: string;
      billable: boolean;
      price: string;
      requestedAt: string;
      elapsedTimeInMilliseconds: number;
      remoteIp: string;
      signature: string;
    };
    dataCount: number;
    data: Array<{
      cnpj: string;
      razaoSocial: string;
      atividadeEconomica: string;
      enderecoLogradouro: string;
      enderecoNumero: string;
      enderecoComplemento: string;
      enderecoBairro: string;
      enderecoMunicipio: string;
      enderecoUf: string;
      telefone: string;
      situacaoCadastral: string;
      situacaoCadastralData: string;
      regimeApuracao: string;
      aberturaData: string;
      capitalSocial: string;
      email: string;
      siteReceipt: string;
      inscricaoEstadual: string;
      [key: string]: any; // Para campos adicionais não especificados
    }>;
    errors: string[];
    siteReceipts: string[];
  }
  