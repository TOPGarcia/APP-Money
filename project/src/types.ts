export interface Task {
  id: string;
  name: string;
  description: string;
  value: number; // Always 10000 CLP
  category: 'work' | 'study' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'study' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: Date;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Character {
  level: number;
  totalEarned: number;
  currentBalance: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  appearance: 'poor' | 'working' | 'middle' | 'wealthy' | 'rich' | 'millionaire';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: Date;
  requiredAmount: number;
  isUnlocked: boolean;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  moneyEarned: number;
  penaltiesApplied: number;
  streakMultiplier: number;
}

export interface Investment {
  id: string;
  name: string;
  cost: number;
  dailyReturn: number;
  icon: string;
  description: string;
  owned: boolean;
  purchasedAt?: Date;
  streakMultiplier: number;
}

export interface Investment {
  id: string;
  name: string;
  cost: number;
  dailyReturn: number;
  icon: string;
  description: string;
  owned: boolean;
  purchasedAt?: Date;
}