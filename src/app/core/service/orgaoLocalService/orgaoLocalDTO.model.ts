export interface OrgaoLocalDTO {
    id: number;
    sigla: string;
    descricao: string;
    tipoOrgaoLocal: number;
    unidadeAdministrativa: number;
    orgaoLocalPai: number;
    dataDesativacao: Date | null; 
  }