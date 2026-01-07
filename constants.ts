
import { Employee } from './types';

export const EMPLOYEES: Employee[] = [
  { id: 'rafael', name: 'Rafael Reis' },
  { id: 'aloisio', name: 'Aloísio José' },
  { id: 'paloma', name: 'Paloma Rebeca' },
  { id: 'ana', name: 'Ana Paula' },
  { id: 'vagner', name: 'Vagner Barreto' },
  { id: 'luis', name: 'Luis Pedro' },
  { id: 'joao', name: 'João Victor' },
  { id: 'yuri', name: 'Yuri Kennedy' },
];

export const EVALUATION_CRITERIA = [
  'Conhecimento Técnico',
  'Cumprimento de Prazos',
  'Habilidades Organizacionais',
  'Habilidades Comunicacionais',
  'Espírito de Colaboração',
  'Trabalho em Grupo',
  'Interação com Colegas',
  'Qualidade no Trabalho',
  'Pontualidade',
  'Assiduidade',
  'Atitude Positiva / Empatia',
  'Resolução de Problemas',
  'Qualidade no Atendimento a Moradores, Visitantes e Colegas',
];

export const RATING_OPTIONS: { label: string; color: string; value: 'Ótimo' | 'Bom' | 'Regular' | 'Ruim' }[] = [
  { label: 'Ótimo', value: 'Ótimo', color: 'bg-green-600 text-white' },
  { label: 'Bom', value: 'Bom', color: 'bg-blue-500 text-white' },
  { label: 'Regular', value: 'Regular', color: 'bg-yellow-500 text-white' },
  { label: 'Ruim', value: 'Ruim', color: 'bg-red-600 text-white' },
];
