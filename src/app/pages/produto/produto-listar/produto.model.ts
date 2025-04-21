export interface ProdutoResponse {
  id?: string;
  nome: string;
  valor: number;
  quantidadeEstoque: number;
  nomeCategoria: string;
  nomeSubcategoria?: string; // pode ser null
}

export interface ProdutoRequest {
  nome: string;
  valor: number;
  quantidadeEstoque: number;
  idCategoria: string;
  idSubcategoria?: string;
}
