export interface MovimentacaoEstoqueResponseDTO {
    id: string;
    idProduto: string; // UUID como string
    data: string; // LocalDate no formato ISO (yyyy-MM-dd)
    quantidade: number;
    observacao?: string;
    tipoMovimentacao: TipoMovimentacao;
    idUsuario: string; // UUID como string
}

export interface MovimentacaoEstoqueRequestDTO {
    idProduto: string;
    data: string;
    quantidade: number;
    observacao?: string;
    tipoAcerto: TipoMovimentacao;
}
export type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'SAIDA_MANUAL' | 'ENTRADA_MANUAL';
