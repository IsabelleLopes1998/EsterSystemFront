export interface CompraItemRequest {
  produtoId: string;
  valorUnitario: number;
  quantidadeVenda: number;
}

export interface CompraRequest {
  data: string;
  fornecedor: string;
  itens: CompraItemRequest[];
}

export interface CompraItemResponse {
  nomeProduto: string;
  valorUnitario: number;
  quantidade: number;
}

export interface CompraResponse {
  id: string;
  data: string;
  fornecedor: string;
  nomeUsuario: string;
  itens: CompraItemResponse[];
}