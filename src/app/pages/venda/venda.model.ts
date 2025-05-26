export enum FormaPagamento {
    DINHEIRO = 'DINHEIRO',
    CARTAO_CREDITO = 'CARTAO_CREDITO',
    CARTAO_DEBITO = 'CARTAO_DEBITO',
    PIX = 'PIX'
}

export interface VendaItemDTO {
    produtoId: string; // UUID como string
    quantidadeVenda: number;
}

export interface VendaRequestDTO {
    data: string; // LocalDate como string no formato ISO
    idCliente: string;
    formaPagamento: string;
    vendaItemList: VendaItemDTO[];
} 