export enum TipoSistemaFreioEnum {
    ABS = "1",
    DISCO = "2",
    TAMBOR = "3"
}

export const TipoSistemaFreioDescricao = [
    { value: TipoSistemaFreioEnum.ABS, key: "ABS" ,label: 'ABS' },
    { value: TipoSistemaFreioEnum.DISCO, key: "DISCO" ,label: 'Disco' },
    { value: TipoSistemaFreioEnum.TAMBOR, key: "TAMBOR" ,label: 'Tambor' }
];

export const TipoSistemaFreioDescricaoId = [
    { value: 1, key: "ABS", label: 'ABS' },
    { value: 2, key: "DISCO", label: 'Disco' },
    { value: 3, key: "TAMBOR", label: 'Tambor' }
];