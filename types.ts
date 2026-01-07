
export type RatingValue = 'Ótimo' | 'Bom' | 'Regular' | 'Ruim';

export interface AdvancedSessionData {
  report: string;
  photos: string[]; // Base64 strings
  link: string;
  date: string;
}

export interface EvaluationData {
  id: string; // ID do colaborador
  supervisorId: string; // ID do supervisor que realizou a avaliação
  employeeName: string;
  role: string;
  referenceMonth: string;
  evaluator: string;
  ratings: Record<string, RatingValue>;
  observations: string;
  advancedSession?: AdvancedSessionData;
  employeeSignature: string;
  evaluatorSignature: string;
  lastUpdated: number;
}

export interface Employee {
  id: string;
  name: string;
  role?: string;
}

export interface Supervisor {
  id: string;
  name: string;
  employees: Employee[];
}
