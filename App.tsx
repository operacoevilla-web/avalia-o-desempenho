
import React, { useState, useEffect } from 'react';
import { Supervisor, Employee } from './types';
import { db } from './services/db';
import EmployeeView from './components/EmployeeView';
import SupervisorLogin from './components/SupervisorLogin';

const App: React.FC = () => {
  const [loggedSupervisor, setLoggedSupervisor] = useState<Supervisor | null>(null);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleAddEmployee = () => {
    if (!loggedSupervisor || !newEmpName.trim()) return;
    const newEmp: Employee = {
      id: Date.now().toString(),
      name: newEmpName
    };
    const updatedSup = {
      ...loggedSupervisor,
      employees: [...loggedSupervisor.employees, newEmp]
    };
    db.saveSupervisor(updatedSup);
    setLoggedSupervisor(updatedSup);
    setNewEmpName('');
    setShowAddEmployee(false);
    setActiveEmployee(newEmp);
  };

  const logout = () => {
    setLoggedSupervisor(null);
    setActiveEmployee(null);
  };

  if (!loggedSupervisor) {
    return <SupervisorLogin onSelect={setLoggedSupervisor} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <nav className="lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 z-40 transition-colors duration-300 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-indigo-900 dark:bg-indigo-950 text-white flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black tracking-tight leading-tight uppercase">
              Gestão Operacional
            </h1>
            <p className="text-indigo-300 dark:text-indigo-400 text-xs font-bold uppercase mt-1">
              {loggedSupervisor.name}
            </p>
          </div>
          <button onClick={logout} className="text-indigo-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
        
        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          <div className="flex justify-between items-center px-2 mb-4">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sua Equipe</span>
            <button 
              onClick={() => setShowAddEmployee(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-indigo-600 dark:text-indigo-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>

          {loggedSupervisor.employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setActiveEmployee(emp)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 ${
                activeEmployee?.id === emp.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeEmployee?.id === emp.id ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
              <span className="truncate">{emp.name}</span>
            </button>
          ))}

          {loggedSupervisor.employees.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-10 px-4 italic">Clique no "+" para cadastrar seu primeiro colaborador.</p>
          )}
        </div>

        {/* User Toggle Theme */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest"
          >
            {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
            {isDarkMode ? <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg> : <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>}
          </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        {activeEmployee ? (
          <div className="p-4 lg:p-8">
            <EmployeeView 
              key={`${loggedSupervisor.id}_${activeEmployee.id}`} 
              employee={activeEmployee} 
              supervisorId={loggedSupervisor.id}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Pronto para começar?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">Selecione um colaborador na barra lateral ou adicione um novo para iniciar a avaliação mensal.</p>
          </div>
        )}
      </main>

      {/* Modal Adicionar Colaborador */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">Novo Colaborador</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nome Completo</label>
                <input
                  type="text"
                  autoFocus
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-800 rounded-2xl focus:border-indigo-500 focus:outline-none dark:text-white font-bold"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddEmployee(false)} className="flex-1 p-4 text-gray-400 font-bold">Cancelar</button>
                <button onClick={handleAddEmployee} className="flex-1 p-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100">Adicionar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
