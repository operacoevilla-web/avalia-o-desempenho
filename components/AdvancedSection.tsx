
import React, { useState } from 'react';
import { AdvancedSessionData } from '../types';

interface AdvancedSectionProps {
  data: AdvancedSessionData;
  onChange: (updated: Partial<AdvancedSessionData>) => void;
  onSave: () => void;
}

const AdvancedSection: React.FC<AdvancedSectionProps> = ({ data, onChange, onSave }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setIsUploading(true);
    const files = Array.from(e.target.files).slice(0, 4 - data.photos.length) as File[];
    
    const newPhotos = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );

    onChange({ photos: [...data.photos, ...newPhotos] });
    setIsUploading(false);
  };

  const removePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    onChange({ photos: updated });
  };

  return (
    <div className="mt-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 text-red-800 dark:text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-bold">Sessão Avançada de Acompanhamento</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Relatório Detalhado</label>
          <textarea
            value={data.report}
            onChange={(e) => onChange({ report: e.target.value })}
            placeholder="Descreva detalhadamente a situação..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Anexar Fotos (Máx 4)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.photos.map((p, idx) => (
                <div key={idx} className="relative group w-20 h-20">
                  <img src={p} className="w-full h-full object-cover rounded border border-gray-300 dark:border-gray-600" alt={`Anexo ${idx + 1}`} />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              ))}
            </div>
            {data.photos.length < 4 && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isUploading}
                className="text-xs text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-100 dark:file:bg-red-900/50 file:text-red-700 dark:file:text-red-300 hover:file:bg-red-200 dark:hover:file:bg-red-900/70"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Link Externo</label>
            <input
              type="url"
              value={data.link}
              onChange={(e) => onChange({ link: e.target.value })}
              placeholder="https://..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mt-3 mb-1">Data do Registro</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white font-bold rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Salvar Relatório Avançado
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSection;
