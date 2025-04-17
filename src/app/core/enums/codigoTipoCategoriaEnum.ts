export enum CodigoTipoCategoriaEnum {
    PARTICULAR = "1",
    ALUGUEL = "2",
    OFICIAL = "3",
    EXPERIENCIA = "4",
    APRENDIZAGEM = "5",
    FABRICANTE = "6",
    MISSAO_DIPLOMATICA = "7",
    CORPO_CONSULAR = "8",
    ORGANIZACOES_INTERNACIONAIS = "9"
}

export const CodigoTipoCategoriaDescricao = [
    { value: CodigoTipoCategoriaEnum.PARTICULAR, label: 'Particular' },
    { value: CodigoTipoCategoriaEnum.ALUGUEL, label: 'Aluguel' },
    { value: CodigoTipoCategoriaEnum.OFICIAL, label: 'Oficial' },
    { value: CodigoTipoCategoriaEnum.EXPERIENCIA, label: 'Experiência' },
    { value: CodigoTipoCategoriaEnum.APRENDIZAGEM, label: 'Aprendizagem' },
    { value: CodigoTipoCategoriaEnum.FABRICANTE, label: 'Fabricante' },
    { value: CodigoTipoCategoriaEnum.MISSAO_DIPLOMATICA, label: 'Missão Diplomática' },
    { value: CodigoTipoCategoriaEnum.CORPO_CONSULAR, label: 'Corpo Consular' },
    { value: CodigoTipoCategoriaEnum.ORGANIZACOES_INTERNACIONAIS, label: 'Organizações Internacionais' }
];
