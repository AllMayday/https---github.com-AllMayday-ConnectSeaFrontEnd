export interface Navio {
  id: number;
  nome: string;
  numeroIMO: string;   
  bandeira?: string | null;
  tonelagem: number;   
}

export interface Berco {
  id: number;
  nome: string;
  draftMaximo: number;  
  loaMaximo: number;    
}

export interface Agenda {
  id: number;
  navioId: number;
  navio?: Navio | null;
  bercoId: number | null;
  berco?: Berco | null;
  chegada: string | Date;
  partida: string | Date;
  etb: string | Date;            
  status: string;              
  porto: string;
  cargas: Carga[];             
  manifestos: Manifesto[];
  manifestoId: number;
}

export interface Carga {
  id: number;
  agendaId: number;
  agenda?: Agenda | null;
  descricao: string;
  pesoEmKg: number;
  tipo: string;
}

export interface Manifesto {
  id: number;
  numero: string;
  tipo: string;
  navioId: number;
  navio: Navio;
  portoOrigem: string;
  portoDestino: string;
  escalas: Agenda[];           
}
