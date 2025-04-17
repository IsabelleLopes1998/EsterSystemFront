export enum CodigoTipoCombustivelEquipamentoEnum {
    GASOLINA = "1",
    GÁS_GLP = "2",
    GASOLINA_GÁS_GLP = "3",
}

export const CodigoTipoCombustivelEquipamentoDescricao = [
    { value: CodigoTipoCombustivelEquipamentoEnum.GASOLINA, label: 'Gasolina' },
    { value: CodigoTipoCombustivelEquipamentoEnum.GÁS_GLP, label: 'Gás GLP' },
    { value: CodigoTipoCombustivelEquipamentoEnum.GASOLINA_GÁS_GLP, label: 'Gasolina/Gás GLP' },
];
