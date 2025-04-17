export enum CategoriaCnhEnum {
    A = "1",
    B = "2",
    C = "3",
    D = "4",
    E = "5",
    AB = "6",
    AC = "7",
    AD = "8",
    AE = "9"
}

export const CategoriaCnhDescricao = [
    { value: CategoriaCnhEnum.A,key: "A", label: 'A (Motocicletas)' },
    { value: CategoriaCnhEnum.B,key: "B", label: 'B (Veículos de passeio e comerciais leves)' },
    { value: CategoriaCnhEnum.C,key: "C", label: 'C (Veículos de carga)' },
    { value: CategoriaCnhEnum.D,key: "D", label: 'D (Veículos de transporte de passageiros' },
    { value: CategoriaCnhEnum.E,key: "E", label: 'E (Veículos com unidades acopladas)' },
    { value: CategoriaCnhEnum.AB,key: "AB", label: 'AB (Motocicletas e veículos leves)' },
    { value: CategoriaCnhEnum.AC,key: "AD", label: 'AC (Motocicletas e veículos de carga)' },
    { value: CategoriaCnhEnum.AD,key: "AD", label: 'AD (Motocicletas e veículos de passageiros)' },
    { value: CategoriaCnhEnum.AE,key: "AE", label: 'AE (Motocicletas e veículos com unidades acopladas)' }
];


export const CategoriaCnhId = [
    { value: 1,key: "A", label: 'A (Motocicletas)' },
    { value: 2,key: "B", label: 'B (Veículos de passeio e comerciais leves)' },
    { value: 3,key: "C", label: 'C (Veículos de carga)' },
    { value: 4,key: "D", label: 'D (Veículos de transporte de passageiros' },
    { value: 5,key: "E", label: 'E (Veículos com unidades acopladas)' },
    { value: 6,key: "A,B", label: 'AB (Motocicletas e veículos leves)' },
    { value: 7,key: "A,D", label: 'AC (Motocicletas e veículos de carga)' },
    { value: 8,key: "A,D", label: 'AD (Motocicletas e veículos de passageiros)' },
    { value: 9,key: "A,E", label: 'AE (Motocicletas e veículos com unidades acopladas)' }
];
