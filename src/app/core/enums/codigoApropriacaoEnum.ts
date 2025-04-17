export enum CodigoApropriacaoEnum {
    ADMINISTRACAO = "1",
    ARRECADACAO = "2",
    FISCALIZACAO = "3"
}

export const CodigoApropriacaoDescricao = [
    { value: CodigoApropriacaoEnum.ADMINISTRACAO, key: "ADMINISTRACAO", label: 'Administração' },
    { value: CodigoApropriacaoEnum.ARRECADACAO, key: "ARRECADACAO", label: 'Arrecadação' },
    { value: CodigoApropriacaoEnum.FISCALIZACAO, key: "FISCALIZACAO", label: 'Fiscalização' }
];

export const CodigoApropriacaoId = [
    { value: 1, key: "ADMINISTRACAO", label: 'Administração' },
    { value: 2, key: "ARRECADACAO", label: 'Arrecadação' },
    { value: 3, key: "FISCALIZACAO", label: 'Fiscalização' }
];
