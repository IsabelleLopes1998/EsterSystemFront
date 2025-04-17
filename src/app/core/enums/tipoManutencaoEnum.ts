export enum tipoManutencaoEnum {
    PREVENTIVA = "1",
    CORRETIVA = "2",
    REVISAO = "3"
}

export const tipoManutencaoEnumDescricao = [
    { value: tipoManutencaoEnum.PREVENTIVA, key: "PREVENTIVA", label: 'Preventiva' },
    { value: tipoManutencaoEnum.CORRETIVA, key: "CORRETIVA", label: 'Corretiva' },
    { value: tipoManutencaoEnum.REVISAO, key: "REVISÃO", label: 'Revisão' },
]