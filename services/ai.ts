
import { GoogleGenAI } from "@google/genai";
import { EvaluationData } from "../types";

export const generateAIReport = async (data: EvaluationData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise os seguintes dados de avaliação de desempenho e gere um relatório detalhado seguindo a estrutura abaixo.
    
    DADOS:
    Funcionário: ${data.employeeName}
    Cargo: ${data.role}
    Mês: ${data.referenceMonth}
    Avaliador: ${data.evaluator}
    Avaliações (Critérios): ${JSON.stringify(data.ratings)}
    Observações: ${data.observations}
    Relatório Avançado: ${data.advancedSession?.report || 'Nenhum'}

    ESTRUTURA DO RELATÓRIO:
    1. Resumo Executivo: Desempenho geral, pontos fortes e pontos de atenção.
    2. Análise Detalhada por Competência: Explique o que cada nota representa e os impactos operacionais/comportamentais.
    3. Plano de Melhoria: Se houver notas "Regular" ou "Ruim", crie ações práticas.
    4. Mensagem de Reconhecimento: Se o desempenho for positivo, inclua um elogio formal.
    5. Conclusão: Síntese final e expectativas.

    IMPORTANTE: Use um tom profissional, imparcial e construtivo. Retorne o conteúdo formatado em Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao gerar relatório IA:", error);
    throw new Error("Não foi possível gerar o relatório no momento.");
  }
};
