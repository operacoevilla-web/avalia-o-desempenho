
import { EvaluationData, Supervisor, Employee } from '../types';

const STORAGE_KEY_EVALS = 'evaluations_v2';
const STORAGE_KEY_SUPERVISORS = 'supervisors_v2';

export const db = {
  // --- Supervisores ---
  getSupervisors: (): Supervisor[] => {
    const raw = localStorage.getItem(STORAGE_KEY_SUPERVISORS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveSupervisor: (supervisor: Supervisor) => {
    const supervisors = db.getSupervisors();
    const index = supervisors.findIndex(s => s.id === supervisor.id);
    if (index >= 0) {
      supervisors[index] = supervisor;
    } else {
      supervisors.push(supervisor);
    }
    localStorage.setItem(STORAGE_KEY_SUPERVISORS, JSON.stringify(supervisors));
  },

  // --- Avaliações ---
  saveEvaluation: (data: EvaluationData) => {
    const allData = db.getAllEvaluations();
    // Chave composta para permitir que múltiplos supervisores avaliem o mesmo nome se necessário
    const key = `${data.supervisorId}_${data.id}`;
    allData[key] = { ...data, lastUpdated: Date.now() };
    localStorage.setItem(STORAGE_KEY_EVALS, JSON.stringify(allData));
  },

  getEvaluation: (supervisorId: string, employeeId: string): EvaluationData | null => {
    const allData = db.getAllEvaluations();
    return allData[`${supervisorId}_${employeeId}`] || null;
  },

  getAllEvaluations: (): Record<string, EvaluationData> => {
    const raw = localStorage.getItem(STORAGE_KEY_EVALS);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
};
