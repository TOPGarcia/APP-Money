import React from 'react';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { DailyStats } from '../types';
import { formatCurrency } from '../utils/achievements';

interface StatsProps {
  dailyStats: DailyStats[];
  totalEarned: number;
  currentBalance: number;
  todayTasks: number;
}

export default function Stats({ dailyStats, totalEarned, currentBalance, todayTasks }: StatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats.find(stat => stat.date === today);
  const weekStats = dailyStats.slice(-7);
  
  const weeklyTotal = weekStats.reduce((sum, day) => sum + day.moneyEarned, 0);
  const weeklyTasks = weekStats.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const avgTasksPerDay = weeklyTasks / Math.max(weekStats.length, 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart3 className="text-blue-500" />
        Estadísticas
      </h2>
      
      {/* Today's Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Calendar className="mx-auto text-blue-500 mb-2" size={24} />
          <p className="text-sm text-gray-600">Hoy</p>
          <p className="text-lg font-bold text-blue-600">{todayTasks} tareas</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <DollarSign className="mx-auto text-green-500 mb-2" size={24} />
          <p className="text-sm text-gray-600">Ganado Hoy</p>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(todayStats?.moneyEarned || 0)}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <TrendingUp className="mx-auto text-purple-500 mb-2" size={24} />
          <p className="text-sm text-gray-600">Esta Semana</p>
          <p className="text-lg font-bold text-purple-600">
            {formatCurrency(weeklyTotal)}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <BarChart3 className="mx-auto text-yellow-500 mb-2" size={24} />
          <p className="text-sm text-gray-600">Promedio/Día</p>
          <p className="text-lg font-bold text-yellow-600">
            {Math.round(avgTasksPerDay)} tareas
          </p>
        </div>
      </div>
      
      {/* Weekly Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Últimos 7 días</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weekStats.map((day, index) => {
            const maxEarned = Math.max(...weekStats.map(d => d.moneyEarned), 50000);
            const height = (day.moneyEarned / maxEarned) * 100;
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-1000 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                  title={`${formatCurrency(day.moneyEarned)} - ${day.tasksCompleted} tareas`}
                ></div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).toLocaleDateString('es-CL', { weekday: 'short' })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-1">Total Acumulado</h4>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalEarned)}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
          <h4 className="font-semibold text-gray-700 mb-1">Balance Actual</h4>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(currentBalance)}
          </p>
        </div>
      </div>
    </div>
  );
}