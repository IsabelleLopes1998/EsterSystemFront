export enum TipoEquipamentosEnum {
    EMPILHADEIRA = "1",
    GERADOR = "2",
    ROCADEIRA = "3",
}

export const TipoEquipamentosEnumDescricao = [
    { value: TipoEquipamentosEnum.EMPILHADEIRA, label: 'Empilhadeira' },
    { value: TipoEquipamentosEnum.GERADOR, label: 'Gerador' },
    { value: TipoEquipamentosEnum.ROCADEIRA, label: 'Roçadeira' }
];

export const TipoEquipamentosEnumDescricaoId = [
    { value: 1, key: "EMPILHADEIRA", label: 'Empilhadeira' },
    { value: 2, key: "GERADOR", label: 'Gerador' },
    { value: 3, key: "ROCADEIRA", label: 'Roçadeira' }
];