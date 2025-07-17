import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-task',
    title: 'Primer Paso',
    description: 'Completa tu primera tarea',
    requiredAmount: 10000,
    isUnlocked: false
  },
  {
    id: 'hundred-k',
    title: 'Trabajador Constante',
    description: 'Alcanza $100,000 CLP',
    requiredAmount: 100000,
    isUnlocked: false
  },
  {
    id: 'half-million',
    title: 'Camino al Éxito',
    description: 'Alcanza $500,000 CLP',
    requiredAmount: 500000,
    isUnlocked: false
  },
  {
    id: 'millionaire',
    title: 'Millonario',
    description: 'Alcanza $1,000,000 CLP',
    requiredAmount: 1000000,
    isUnlocked: false
  },
  {
    id: 'two-million',
    title: 'Magnate',
    description: 'Alcanza $2,000,000 CLP',
    requiredAmount: 2000000,
    isUnlocked: false
  },
  {
    id: 'five-million',
    title: 'Emperador del Dinero',
    description: 'Alcanza $5,000,000 CLP',
    requiredAmount: 5000000,
    isUnlocked: false
  }
];

export function getCharacterAppearance(totalEarned: number): string {
  if (totalEarned >= 10000000) return 'millionaire';  // $10M CLP
  if (totalEarned >= 5000000) return 'rich';          // $5M CLP
  if (totalEarned >= 2000000) return 'wealthy';       // $2M CLP
  if (totalEarned >= 1000000) return 'middle';        // $1M CLP
  if (totalEarned >= 200000) return 'working';        // $200K CLP
  return 'poor';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.3;
  if (streak >= 3) return 1.2;
  return 1.0;
}

export function getCategoryColor(category: string): string {
  const colors = {
    work: 'bg-blue-100 text-blue-800 border-blue-200',
    study: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    health: 'bg-green-100 text-green-800 border-green-200',
    personal: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return colors[category as keyof typeof colors] || colors.personal;
}

export function getCategoryIcon(category: string): string {
  const icons = {
    work: '💼',
    study: '📚',
    health: '💪',
    personal: '🎯'
  };
  return icons[category as keyof typeof icons] || '📝';
}

export function getPriorityMultiplier(priority: string): number {
  const multipliers = {
    low: 1.0,
    medium: 1.2,
    high: 1.5
  };
  return multipliers[priority as keyof typeof multipliers] || 1.0;
}

export const INVESTMENTS = [
  {
    id: 'laptop',
    name: 'Laptop Profesional',
    cost: 500000,
    dailyReturn: 5000,
    icon: '💻',
    description: 'Aumenta tu productividad diaria'
  },
  {
    id: 'course',
    name: 'Curso Online',
    cost: 200000,
    dailyReturn: 3000,
    icon: '🎓',
    description: 'Inversión en conocimiento'
  },
  {
    id: 'gym',
    name: 'Membresía Gym',
    cost: 100000,
    dailyReturn: 2000,
    icon: '🏋️',
    description: 'Salud = Productividad'
  },
  {
    id: 'office',
    name: 'Oficina en Casa',
    cost: 1000000,
    dailyReturn: 15000,
    icon: '🏢',
    description: 'Espacio dedicado al trabajo'
  },
  {
    id: 'car',
    name: 'Auto Eficiente',
    cost: 2000000,
    dailyReturn: 25000,
    icon: '🚗',
    description: 'Ahorra tiempo en transporte'
  },
  {
    id: 'investment',
    name: 'Portafolio de Inversión',
    cost: 5000000,
    dailyReturn: 50000,
    icon: '📈',
    description: 'Ingresos pasivos avanzados'
  }
];