export enum CodigoEstadoConservacaoEnum {
    OTIMO = "1",
    BOM = "2",
    REGULAR = "3",
    PESSIMO = "4"
}

export const CodigoEstadoConservacaoDescricao = [
    { value: CodigoEstadoConservacaoEnum.OTIMO, key: "OTIMO", label: 'Ótimo' },
    { value: CodigoEstadoConservacaoEnum.BOM, key: "BOM", label: 'Bom' },
    { value: CodigoEstadoConservacaoEnum.REGULAR, key: "REGULAR", label: 'Regular' },
    { value: CodigoEstadoConservacaoEnum.PESSIMO, key: "PESSIMO", label: 'Péssimo' }
];

export const CodigoEstadoConservacaoDescricaoId = [
    {value: 1, key:"OTIMO", label:'Ótimo'},
    {value: 1, key:"BOM", label:'Bom'},
    {value: 1, key:"REGULAR", label:'Regular'},
    {value: 1, key:"PESSIMO", label:'Péssimo'}
];