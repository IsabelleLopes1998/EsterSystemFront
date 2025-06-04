export interface CompraItemRequest {
  produtoId: string;
  valorUnitario: number;
  quantidade: number;
}

export interface CompraRequest {
  data: string;
  fornecedor: string;
  itens: CompraItemRequest[];
  valorTotalDaCompra: number;

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
  valorTotalDaCompra: number;
  itens: CompraItemResponse[];
}
