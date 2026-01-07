
import React, { useState } from 'react';
import { Supervisor } from '../types';
import { db } from '../services/db';

interface SupervisorLoginProps {
  onSelect: (supervisor: Supervisor) => void;
}

const SupervisorLogin: React.FC<SupervisorLoginProps> = ({ onSelect }) => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>(db.getSupervisors());
  const [newMode, setNewMode] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newSup: Supervisor = {
      id: Date.now().toString(),
      name: newName,
      employees: []
    };
    db.saveSupervisor(newSup);
    setSupervisors([...supervisors, newSup]);
    setNewMode(false);
    setNewName('');
    onSelect(newSup);
  };

  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Portal do Supervisor</h1>
          <p className="text-indigo-200 text-sm mt-1">Gestão de Desempenho Operacional</p>
        </div>

        <div className="p-8">
          {!newMode ? (
            <>
              <h2 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-6">Selecione seu perfil</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {supervisors.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSelect(s)}
                    className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-gray-700 group-hover:text-indigo-700">{s.name}</span>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                ))}
                
                {supervisors.length === 0 && (
                  <p className="text-center text-gray-400 py-4 text-sm italic">Nenhum supervisor cadastrado.</p>
                )}
              </div>

              <button
                onClick={() => setNewMode(true)}
                className="w-full mt-8 p-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Novo Supervisor
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Nome Completo</label>
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Supervisor Charles"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:outline-none font-bold"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setNewMode(false)}
                  className="flex-1 p-4 text-gray-400 font-bold hover:bg-gray-100 rounded-2xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorLogin;
