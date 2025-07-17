import React, { useState } from 'react';
import { Target, Plus, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Goal } from '../types';
import { formatCurrency } from '../utils/achievements';

interface GoalManagerProps {
  goals: Goal[];
  currentBalance: number;
  onGoalAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onApplyPenalty: (amount: number) => void;
}

export default function GoalManager({ goals, currentBalance, onGoalAdd, onApplyPenalty }: GoalManagerProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('2000000');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalTitle.trim() && targetAmount && deadline) {
      onGoalAdd({
        title: goalTitle.trim(),
        targetAmount: parseInt(targetAmount),
        deadline: new Date(deadline),
        isActive: true
      });
      setGoalTitle('');
      setTargetAmount('2000000');
      setDeadline('');
      setIsAddingGoal(false);
    }
  };

  const activeGoals = goals.filter(goal => goal.isActive);
  const expiredGoals = goals.filter(goal => 
    goal.isActive && new Date(goal.deadline) < new Date() && currentBalance < goal.targetAmount
  );

  const handlePenalty = (goal: Goal) => {
    onApplyPenalty(20000);
    // Show motivational message
    alert('💪 "No se trata de talento, sino de persistencia. Hoy es un buen día para reintentarlo."');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Target className="text-blue-500" />
          Metas Financieras
        </h2>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <Plus size={20} />
          Nueva Meta
        </button>
      </div>

      {/* Add Goal Form */}
      {isAddingGoal && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la meta
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Meta mensual de enero"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto objetivo
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000000"
                  step="10000"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha límite
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Crear Meta
              </button>
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expired Goals with Penalty */}
      {expiredGoals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
            <AlertTriangle size={20} />
            Metas Vencidas
          </h3>
          {expiredGoals.map((goal) => (
            <div key={goal.id} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-red-800">{goal.title}</h4>
                <button
                  onClick={() => handlePenalty(goal)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Aplicar Penalización
                </button>
              </div>
              <p className="text-sm text-red-600 mb-2">
                Meta: {formatCurrency(goal.targetAmount)} | Actual: {formatCurrency(currentBalance)}
              </p>
              <p className="text-xs text-red-500">
                Vencida el {new Date(goal.deadline).toLocaleDateString('es-CL')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Active Goals */}
      <div className="space-y-4">
        {activeGoals.filter(goal => !expiredGoals.includes(goal)).map((goal) => {
          const progress = Math.min((currentBalance / goal.targetAmount) * 100, 100);
          const tasksNeeded = Math.max(0, Math.ceil((goal.targetAmount - currentBalance) / 10000));
          const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
          
          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {formatCurrency(currentBalance)} / {formatCurrency(goal.targetAmount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {daysLeft} días restantes
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600">Progreso</span>
                  <span className="text-sm font-bold text-gray-800">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                      progress >= 100 ? 'bg-green-500' : progress >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-xs text-gray-600">Tareas restantes</p>
                  <p className="font-bold text-blue-600">{tasksNeeded}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-600">Tareas por día</p>
                  <p className="font-bold text-green-600">
                    {daysLeft > 0 ? Math.ceil(tasksNeeded / daysLeft) : tasksNeeded}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {activeGoals.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500">No tienes metas activas. ¡Crea una nueva para comenzar!</p>
          </div>
        )}
      </div>
    </div>
  );
}