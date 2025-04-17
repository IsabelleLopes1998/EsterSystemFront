export enum TipoInatividade {
    LICENÇAMARTERNIDADEPARTERNIDADE = "1",
    FERIAS = "2",
    ATESTADO = "3",
    DEMISSAO = "4",
    MOTORISTA_PROVISORIO = "5"

}

export const TipoInatividadeDescricao = [
    { value: TipoInatividade.LICENÇAMARTERNIDADEPARTERNIDADE, key: "LICENÇA MATERNIDADE/PATERNIDADE", label: 'Licença maternidade/paternidade' },
    { value: TipoInatividade.FERIAS, key: "FERIAS", label: 'Férias' },
    { value: TipoInatividade.ATESTADO, key: "ATESTADO", label: 'Atestado' },
    { value: TipoInatividade.DEMISSAO, key: "DEMISSAO", label: 'Demissão' },
    { value: TipoInatividade.MOTORISTA_PROVISORIO, key: "MOTORISTA_PROVISORIO", label: 'Motorista provisório' }
];

export const TipoInatividadeDescricaoId = [
    { value: 1, key: "LICENÇA MATERNIDADE/PATERNIDADE", label: 'Licença maternidade/paternidade' },
    { value: 2, key: "FERIAS", label: 'Férias' },
    { value: 3, key: "ATESTADO", label: 'Atestado' },
    { value: 4, key: "DEMISSAO", label: 'Demissao' },
    { value: 5, key: "MOTORISTA_PROVISORIO", label: 'Motorista provisório' }
];