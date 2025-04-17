export enum StatusVeiculoEnum {
    EM_USO = "1",
    CEDIDO = "2",
    LEILAO = "3",
    TRANSFERIDO = "4"
}

export const StatusVeiculoDescricao = [
    { value: StatusVeiculoEnum.EM_USO, key: "EM USO",label: 'Em Uso' },
    { value: StatusVeiculoEnum.CEDIDO, key: "CEDIDO",label: 'Cedido' },
    { value: StatusVeiculoEnum.LEILAO, key: "LEILAO",label: 'Leilão' },
    { value: StatusVeiculoEnum.TRANSFERIDO, key: "TRANSFERIDO",label: 'Transferido' }
];