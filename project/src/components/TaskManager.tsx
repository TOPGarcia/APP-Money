import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Trash2, Edit3, Minus, Flame, Star } from 'lucide-react';
import { Task } from '../types';
import { formatCurrency, getCategoryColor, getCategoryIcon, getPriorityMultiplier, calculateStreakMultiplier } from '../utils/achievements';

interface TaskManagerProps {
  tasks: Task[];
  currentStreak: number;
  onTaskComplete: (taskId: string) => void;
  onTaskQuantityChange: (taskId: string, quantity: number) => void;
  onTaskAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function TaskManager({ tasks, currentStreak, onTaskComplete, onTaskQuantityChange, onTaskAdd, onTaskDelete }: TaskManagerProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskCategory, setTaskCategory] = useState<'work' | 'study' | 'health' | 'personal'>('work');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskQuantities, setTaskQuantities] = useState<Record<string, number>>({});

  const getTaskQuantity = (taskId: string) => taskQuantities[taskId] || 1;

  const updateTaskQuantity = (taskId: string, change: number) => {
    const currentQuantity = getTaskQuantity(taskId);
    const newQuantity = Math.max(1, currentQuantity + change);
    setTaskQuantities(prev => ({
      ...prev,
      [taskId]: newQuantity
    }));
  };

  const handleTaskComplete = (taskId: string) => {
    const quantity = getTaskQuantity(taskId);
    onTaskQuantityChange(taskId, quantity);
    onTaskComplete(taskId);
    // Reset quantity after completion
    setTaskQuantities(prev => ({
      ...prev,
      [taskId]: 1
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onTaskAdd({
        name: taskName.trim(),
        description: taskDescription.trim(),
        value: 10000,
        category: taskCategory,
        priority: taskPriority
      });
      setTaskName('');
      setTaskDescription('');
      setTaskCategory('work');
      setTaskPriority('medium');
      setIsAddingTask(false);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const streakMultiplier = calculateStreakMultiplier(currentStreak);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
          {currentStreak > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Flame className="text-orange-500" size={16} />
              <span className="text-sm text-orange-600 font-medium">
                Racha: {currentStreak} días (x{streakMultiplier.toFixed(1)} bonus)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsAddingTask(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la tarea
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Escribir 1 página de tesis"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="work">💼 Trabajo</option>
                  <option value="study">📚 Estudio</option>
                  <option value="health">💪 Salud</option>
                  <option value="personal">🎯 Personal</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detalles adicionales..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">🟢 Baja (x1.0)</option>
                  <option value="medium">🟡 Media (x1.2)</option>
                  <option value="high">🔴 Alta (x1.5)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Crear Tarea
              </button>
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending Tasks */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Pendientes ({pendingTasks.length})</h3>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(task.category)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                  {task.category}
                </span>
                {task.priority === 'high' && <Star className="text-red-500" size={16} />}
              </div>
              <button
                onClick={() => handleTaskComplete(task.id)}
                className="text-gray-400 hover:text-green-500 transition-colors flex-shrink-0"
              >
                <Circle size={24} />
              </button>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{task.name}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600">{task.description}</p>
                )}
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-2 py-1">
                <button
                  onClick={() => updateTaskQuantity(task.id, -1)}
                  className="text-gray-500 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                  disabled={getTaskQuantity(task.id) <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="font-bold text-gray-800 min-w-[2rem] text-center">
                  {getTaskQuantity(task.id)}
                </span>
                <button
                  onClick={() => updateTaskQuantity(task.id, 1)}
                  className="text-gray-500 hover:text-green-500 transition-colors p-1 flex-shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="text-right">
                {(getPriorityMultiplier(task.priority) > 1 || streakMultiplier > 1) && (
                  <div className="text-xs text-orange-600 font-medium">
                    x{(getPriorityMultiplier(task.priority) * streakMultiplier).toFixed(1)} bonus
                  </div>
                )}
                <span className="text-green-600 font-bold">
                  {formatCurrency(task.value * getTaskQuantity(task.id) * getPriorityMultiplier(task.priority) * streakMultiplier)}
                </span>
                <p className="text-xs text-gray-500">x{getTaskQuantity(task.id)}</p>
              </div>
              <button
                onClick={() => onTaskDelete(task.id)}
                className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {pendingTasks.length === 0 && (
            <p className="text-gray-500 text-center py-8">No tienes tareas pendientes. ¡Crea una nueva!</p>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Completadas Hoy ({completedTasks.length})</h3>
          <div className="space-y-2">
            {completedTasks.slice(-5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-500" size={24} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 line-through opacity-75">{task.name}</h4>
                </div>
                <span className="text-green-600 font-bold">{formatCurrency(task.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}