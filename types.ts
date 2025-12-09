export interface ProductionData {
  operador: string;
  maquina: string;
  op: string;
  cp: string;
  startTime: number | null; // Timestamp
  endTime: number | null; // Timestamp
  quantity: number;
  observation: string;
  setupTime: number;
}

export enum AppStep {
  SETUP = 1,
  ORDER = 2,
  TIMER = 3,
  SUMMARY = 4,
  SUCCESS = 5
}

export interface AppState {
  step: AppStep;
  data: ProductionData;
  isRestored: boolean;
}

export const INITIAL_DATA: ProductionData = {
  operador: '',
  maquina: '',
  op: '',
  cp: '',
  startTime: null,
  endTime: null,
  quantity: 0,
  observation: '',
  setupTime: 0
};
