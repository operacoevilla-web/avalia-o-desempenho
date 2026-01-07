
import React, { useState, useEffect, useMemo } from 'react';
import { Employee, EvaluationData, RatingValue } from '../types';
import { EVALUATION_CRITERIA } from '../constants';
import { db } from '../services/db';
import { generateAIReport } from '../services/ai';
import RatingSelector from './RatingSelector';
import AdvancedSection from './AdvancedSection';
import ReportModal from './ReportModal';

interface EmployeeViewProps {
  employee: Employee;
  supervisorId: string;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ employee, supervisorId }) => {
  const [formData, setFormData] = useState<EvaluationData>({
    id: employee.id,
    supervisorId: supervisorId,
    employeeName: employee.name,
    role: '',
    referenceMonth: new Date().toISOString().slice(0, 7),
    evaluator: '', // Será preenchido pelo supervisor se desejar ou automatizado
    ratings: {},
    observations: '',
    employeeSignature: '',
    evaluatorSignature: '',
    lastUpdated: Date.now(),
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const saved = db.getEvaluation(supervisorId, employee.id);
    if (saved) {
      setFormData(saved);
    }
  }, [employee, supervisorId]);

  const shouldShowAdvanced = useMemo(() => {
    const ratingValues = Object.values(formData.ratings);
    if (ratingValues.length === 0) return false;
    const countLow = ratingValues.filter(r => r === 'Regular' || r === 'Ruim').length;
    const hasRuim = ratingValues.some(r => r === 'Ruim');
    return hasRuim || countLow >= 3;
  }, [formData.ratings]);

  const handleRatingChange = (criterion: string, value: RatingValue) => {
    setFormData(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [criterion]: value }
    }));
  };

  const handleGenerateReport = async () => {
    if (Object.keys(formData.ratings).length < 3) {
      setMessage({ text: 'Avalie pelo menos 3 critérios antes de gerar o relatório.', type: 'error' });
      return;
    }
    
    setIsGenerating(true);
    try {
      const report = await generateAIReport(formData);
      setAiReport(report);
      db.saveEvaluation(formData);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAll = () => {
    if (!formData.role) {
      setMessage({ text: 'Por favor, preencha o Cargo.', type: 'error' });
      return;
    }
    db.saveEvaluation(formData);
    setMessage({ text: 'Avaliação salva localmente!', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {message && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-2xl shadow-2xl text-white font-black uppercase text-xs tracking-widest transform transition-all animate-bounce ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message.text}
        </div>
      )}

      {aiReport && (
        <ReportModal 
          data={formData} 
          reportText={aiReport} 
          onClose={() => setAiReport(null)} 
        />
      )}

      {/* Header Info */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              {employee.name}
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Status: Em Avaliação</p>
          </div>
          
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 dark:shadow-none ${
              isGenerating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
            {isGenerating ? 'Analisando...' : 'Gerar Relatório IA'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cargo Operacional *</label>
            <input 
              type="text" 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="Ex: Zelador, Porteiro..."
              className="w-full border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Mês Referência</label>
            <input 
              type="month" 
              value={formData.referenceMonth} 
              onChange={(e) => setFormData({...formData, referenceMonth: e.target.value})}
              className="w-full border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Avaliador Oficial</label>
            <input 
              type="text" 
              value={formData.evaluator} 
              onChange={(e) => setFormData({...formData, evaluator: e.target.value})}
              placeholder="Seu nome"
              className="w-full border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-2xl p-4 focus:border-indigo-500 focus:outline-none transition-all font-bold"
            />
          </div>
        </div>
      </section>

      {/* Assessment Grid */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
        <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 px-8 py-5">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Matriz de Competências</h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {EVALUATION_CRITERIA.map((criterion) => (
            <RatingSelector
              key={criterion}
              label={criterion}
              value={formData.ratings[criterion]}
              onChange={(val) => handleRatingChange(criterion, val)}
            />
          ))}
        </div>
      </section>

      {/* Observations */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-6">
        <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Comentários Adicionais</label>
        <textarea
          value={formData.observations}
          onChange={(e) => setFormData({...formData, observations: e.target.value})}
          placeholder="Ex: Teve um excelente desempenho na manutenção da piscina este mês..."
          className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 dark:text-white rounded-2xl focus:border-indigo-500 focus:outline-none transition-all resize-none font-medium"
        />
      </section>

      {/* Advanced Session */}
      {shouldShowAdvanced && (
        <AdvancedSection 
          data={formData.advancedSession || { report: '', photos: [], link: '', date: '' }}
          onChange={(updated) => setFormData(prev => ({
            ...prev,
            advancedSession: {
              report: '',
              photos: [],
              link: '',
              date: '',
              ...(prev.advancedSession || {}),
              ...updated
            }
          }))}
          onSave={saveAll}
        />
      )}

      {/* Action Footer */}
      <div className="flex justify-center pt-8 pb-12">
        <button
          onClick={saveAll}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest py-5 px-20 rounded-2xl shadow-2xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Salvar Avaliação
        </button>
      </div>
    </div>
  );
};

export default EmployeeView;
