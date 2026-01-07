
import React, { useEffect } from 'react';
import { EvaluationData, RatingValue } from '../types';

interface ReportModalProps {
  data: EvaluationData;
  reportText: string;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ data, reportText, onClose }) => {
  // Fecha o modal com a tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const ratingToPercent = (val: RatingValue | undefined): number => {
    switch (val) {
      case 'Ótimo': return 100;
      case 'Bom': return 75;
      case 'Regular': return 50;
      case 'Ruim': return 25;
      default: return 0;
    }
  };

  // Processador de Texto IA para Documento Formal
  const renderDocumentContent = (text: string) => {
    // 1. Limpeza inicial de artefatos de IA
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```markdown\n?/, '').replace(/```$/, '');
    cleanText = cleanText.replace(/^["']+|["']+$/g, '');

    return cleanText.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      // Títulos
      if (trimmed.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-black text-gray-900 mt-8 mb-4 border-b-2 border-gray-900 pb-2 uppercase tracking-tighter">{parseInlines(trimmed.replace('# ', ''))}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3 border-b border-gray-100 pb-1">{parseInlines(trimmed.replace('## ', ''))}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-bold text-indigo-900 mt-5 mb-2">{parseInlines(trimmed.replace('### ', ''))}</h3>;
      }

      // Listas
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <div key={index} className="flex gap-3 ml-6 mb-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span className="text-gray-700 leading-relaxed">{parseInlines(trimmed.substring(2))}</span>
          </div>
        );
      }

      // Parágrafos
      if (trimmed === '') return <div key={index} className="h-4" />;

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-justify">
          {parseInlines(trimmed)}
        </p>
      );
    });
  };

  const parseInlines = (text: string) => {
    // Substitui **texto** por <strong>texto</strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-950">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-md p-0 md:p-8 print:static print:bg-white print:p-0">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] overflow-hidden md:rounded-3xl shadow-2xl flex flex-col print:shadow-none print:rounded-none print:max-h-none print:overflow-visible print:w-full">
        
        {/* Toolbar de Visualização (Oculta na Impressão) */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-gray-900/95 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-gray-100 uppercase text-sm tracking-tight">Relatório de Desempenho</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Documento Gerado por IA</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              SALVAR PDF / IMPRIMIR
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
              title="Fechar (ESC)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        {/* ÁREA DO DOCUMENTO (O QUE SERÁ IMPRESSO) */}
        <div id="document-print-area" className="flex-1 overflow-y-auto bg-white p-8 md:p-16 print:overflow-visible print:p-0 print:m-0">
          
          {/* Cabeçalho Oficial */}
          <div className="border-b-8 border-gray-900 pb-6 mb-10 flex justify-between items-end">
            <div className="max-w-[70%]">
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">Avaliação Mensal</h1>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">Gestão Operacional de Equipes</p>
            </div>
            <div className="text-right border-l-2 border-gray-100 pl-6">
              <p className="text-[10px] font-black text-gray-300 uppercase mb-1">Registro Digital</p>
              <p className="text-sm font-bold text-gray-900 font-mono tracking-tighter">ID: {data.id.toUpperCase()}</p>
              <p className="text-xs font-medium text-gray-400">{new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          {/* Grid de Informações Básicas */}
          <div className="grid grid-cols-2 gap-8 mb-12 p-8 bg-gray-50 rounded-3xl border border-gray-100 print:bg-transparent print:border-gray-200 print:rounded-none">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Colaborador</label>
                <p className="text-lg font-black text-gray-900 border-b border-gray-200 pb-1">{data.employeeName}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Cargo / Função</label>
                <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1">{data.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Período Avaliado</label>
                <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1">{data.referenceMonth}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Avaliador Responsável</label>
                <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-1">{data.evaluator}</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Competências */}
          <div className="mb-12">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
              <span className="w-10 h-1.5 bg-indigo-600 rounded-full"></span>
              Resumo Visual de Competências
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {(Object.entries(data.ratings) as [string, RatingValue][]).map(([key, value]) => (
                <div key={key} className="flex flex-col group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">{key}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase shadow-sm border ${
                      value === 'Ótimo' ? 'bg-green-50 text-green-700 border-green-100' : 
                      value === 'Bom' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      value === 'Regular' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {value}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        value === 'Ótimo' ? 'bg-green-600' : 
                        value === 'Bom' ? 'bg-blue-500' : 
                        value === 'Regular' ? 'bg-yellow-500' : 'bg-red-600'
                      }`}
                      style={{ width: `${ratingToPercent(value)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Texto Analítico (Markdown Convertido) */}
          <div className="mb-16 pt-10 border-t border-gray-50">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
              <span className="w-10 h-1.5 bg-indigo-600 rounded-full"></span>
              Análise Qualitativa Detalhada
            </h2>
            <div className="document-body-content text-gray-800">
              {renderDocumentContent(reportText)}
            </div>
          </div>

          {/* Observações Adicionais */}
          {data.observations && (
            <div className="mb-16 p-8 bg-gray-50 rounded-[2.5rem] border-l-8 border-indigo-200 print:bg-transparent print:border print:border-gray-100">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Notas Suplementares do Avaliador</p>
              <p className="text-gray-700 italic text-base leading-relaxed leading-7">{data.observations}</p>
            </div>
          )}

          {/* Assinaturas Formais */}
          <div className="mt-32 grid grid-cols-2 gap-20 print:mt-16">
            <div className="text-center">
              <div className="border-b-2 border-gray-900 min-h-[60px] flex items-end justify-center pb-2 px-4">
                <p className="font-serif italic text-2xl text-gray-900 tracking-tight">{data.employeeSignature}</p>
              </div>
              <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assinatura do Colaborador</p>
              <p className="text-[9px] text-gray-300 font-bold mt-1 uppercase">{data.employeeName}</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-gray-900 min-h-[60px] flex items-end justify-center pb-2 px-4">
                <p className="font-serif italic text-2xl text-gray-900 tracking-tight">{data.evaluatorSignature}</p>
              </div>
              <p className="mt-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Assinatura do Avaliador</p>
              <p className="text-[9px] text-gray-300 font-bold mt-1 uppercase">{data.evaluator}</p>
            </div>
          </div>

          {/* Rodapé do Documento */}
          <div className="mt-20 pt-8 border-t border-gray-100 text-center">
            <p className="text-[8px] text-gray-400 uppercase tracking-[0.5em] font-black">
              Autenticação via Gestão Operacional • Confidencial • {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Footer Modal (Oculto na Impressão) */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-6 flex justify-end gap-4 rounded-b-3xl print:hidden">
          <button 
            onClick={onClose}
            className="px-8 py-3 text-gray-400 dark:text-gray-500 font-black text-xs hover:text-gray-900 dark:hover:text-white transition-all uppercase tracking-widest"
          >
            Fechar Visualização
          </button>
        </div>
      </div>

      <style>{`
        /* Otimizações de Impressão */
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Oculta tudo que não for o conteúdo do documento */
          #root > *:not(.fixed),
          .fixed > *:not(.bg-white),
          .print\\:hidden,
          button,
          nav,
          header,
          footer {
            display: none !important;
          }

          /* Transforma o modal em página inteira */
          .fixed {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            overflow: visible !important;
            backdrop-filter: none !important;
          }

          .bg-white {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
            display: block !important;
          }

          #document-print-area {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }

          /* Garante visibilidade das cores (Gráficos) */
          .bg-indigo-600, .bg-green-600, .bg-blue-500, .bg-yellow-500, .bg-red-600, .bg-gray-900 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .text-indigo-600, .text-gray-900, .text-gray-700, .text-green-700 {
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .border-b-8, .border-b-2, .border-l-8 {
            border-color: black !important;
          }

          /* Controle de quebra de página */
          h1, h2, h3 { page-break-after: avoid; }
          .grid { page-break-inside: avoid; }
          p, div { orphans: 3; widows: 3; }
        }
      `}</style>
    </div>
  );
};

export default ReportModal;
