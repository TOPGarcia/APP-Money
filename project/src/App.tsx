import React, { useState, useEffect } from 'react';
import { Coins, Settings, BarChart3, Target, Trophy, ShoppingCart, Clock } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Task, Goal, Character, Achievement, DailyStats, Investment } from './types';
import { ACHIEVEMENTS, getCharacterAppearance, formatCurrency, calculateStreakMultiplier, getPriorityMultiplier, INVESTMENTS } from './utils/achievements';
import TaskManager from './components/TaskManager';
import CharacterComponent from './components/Character';
import GoalManager from './components/GoalManager';
import AchievementsList from './components/AchievementsList';
import Stats from './components/Stats';
import InvestmentShop from './components/InvestmentShop';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('productivity-tasks', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('productivity-goals', []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('productivity-achievements', ACHIEVEMENTS);
  const [dailyStats, setDailyStats] = useLocalStorage<DailyStats[]>('productivity-daily-stats', []);
  const [investments, setInvestments] = useLocalStorage<Investment[]>('productivity-investments', 
    INVESTMENTS.map(inv => ({ ...inv, owned: false }))
  );
  const [character, setCharacter] = useLocalStorage<Character>('productivity-character', {
    level: 1,
    totalEarned: 0,
    currentBalance: 0,
    currentStreak: 0,
    longestStreak: 0,
    appearance: 'poor'
  });
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'character' | 'goals' | 'achievements' | 'stats' | 'investments' | 'pomodoro'>('tasks');

  // Update streak daily
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (character.lastActiveDate !== today) {
      const todayTasks = tasks.filter(task => 
        task.completed && 
        task.completedAt && 
        new Date(task.completedAt).toISOString().split('T')[0] === today
      );
      
      if (todayTasks.length > 0) {
        // User completed tasks today
        if (character.lastActiveDate === yesterday) {
          // Consecutive day - increase streak
          setCharacter(prev => ({
            ...prev,
            currentStreak: prev.currentStreak + 1,
            longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
            lastActiveDate: today
          }));
        } else {
          // First day or broke streak - reset to 1
          setCharacter(prev => ({
            ...prev,
            currentStreak: 1,
            longestStreak: Math.max(prev.longestStreak, 1),
            lastActiveDate: today
          }));
        }
      }
    }
  }, [tasks, character.lastActiveDate]);

  // Apply daily passive income from investments
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastPassiveIncomeDate = localStorage.getItem('lastPassiveIncomeDate');
    
    if (lastPassiveIncomeDate !== today) {
      const dailyPassiveIncome = investments
        .filter(inv => inv.owned)
        .reduce((total, inv) => total + inv.dailyReturn, 0);
      
      if (dailyPassiveIncome > 0) {
        setCharacter(prev => ({
          ...prev,
          currentBalance: prev.currentBalance + dailyPassiveIncome,
          totalEarned: prev.totalEarned + dailyPassiveIncome
        }));
        localStorage.setItem('lastPassiveIncomeDate', today);
      }
    }
  }, [investments]);
  // Update daily stats
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      new Date(task.completedAt).toISOString().split('T')[0] === today
    );
    
    const existingDayIndex = dailyStats.findIndex(stat => stat.date === today);
    const newDayStats: DailyStats = {
      date: today,
      tasksCompleted: todayTasks.length,
      moneyEarned: todayTasks.length * 10000,
      penaltiesApplied: 0,
      streakMultiplier: calculateStreakMultiplier(character.currentStreak)
    };
    
    if (existingDayIndex >= 0) {
      const updatedStats = [...dailyStats];
      updatedStats[existingDayIndex] = newDayStats;
      setDailyStats(updatedStats);
    } else {
      setDailyStats([...dailyStats, newDayStats]);
    }
  }, [tasks]);

  // Update character based on total earned
  useEffect(() => {
    const newAppearance = getCharacterAppearance(character.totalEarned);
    if (newAppearance !== character.appearance) {
      setCharacter(prev => ({
        ...prev,
        appearance: newAppearance as any
      }));
    }
  }, [character.totalEarned]);

  // Check for new achievements
  useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.isUnlocked && character.totalEarned >= achievement.requiredAmount) {
        return {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date()
        };
      }
      return achievement;
    });
    
    if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
      setAchievements(updatedAchievements);
    }
  }, [character.totalEarned]);

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completedAt: new Date() }
          : t
      ));
    }
  };

  const handleTaskQuantityChange = (taskId: string, quantity: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const baseEarnings = 10000 * quantity;
    const priorityMultiplier = getPriorityMultiplier(task.priority);
    const streakMultiplier = calculateStreakMultiplier(character.currentStreak);
    const totalEarnings = baseEarnings * priorityMultiplier * streakMultiplier;
    
    setCharacter(prev => ({
      ...prev,
      totalEarned: prev.totalEarned + totalEarnings,
      currentBalance: prev.currentBalance + totalEarnings
    }));
  };

  const handleTaskAdd = (newTask: Omit<Task, 'id' | 'completed'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false
    };
    setTasks(prev => [...prev, task]);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleGoalAdd = (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setGoals(prev => [...prev, goal]);
  };

  const handleApplyPenalty = (amount: number) => {
    setCharacter(prev => ({
      ...prev,
      currentBalance: Math.max(0, prev.currentBalance - amount)
    }));
    
    // Update daily stats for penalty
    const today = new Date().toISOString().split('T')[0];
    setDailyStats(prev => {
      const existingDayIndex = prev.findIndex(stat => stat.date === today);
      if (existingDayIndex >= 0) {
        const updated = [...prev];
        updated[existingDayIndex] = {
          ...updated[existingDayIndex],
          penaltiesApplied: updated[existingDayIndex].penaltiesApplied + 1
        };
        return updated;
      }
      return prev;
    });
  };

  const handleInvestmentPurchase = (investment: Investment) => {
    if (character.currentBalance >= investment.cost) {
      setCharacter(prev => ({
        ...prev,
        currentBalance: prev.currentBalance - investment.cost
      }));
      
      setInvestments(prev => prev.map(inv => 
        inv.id === investment.id 
          ? { ...inv, owned: true, purchasedAt: new Date() }
          : inv
      ));
    }
  };

  const handlePomodoroComplete = (earnings: number) => {
    const streakMultiplier = calculateStreakMultiplier(character.currentStreak);
    const totalEarnings = earnings * streakMultiplier;
    
    setCharacter(prev => ({
      ...prev,
      totalEarned: prev.totalEarned + totalEarnings,
      currentBalance: prev.currentBalance + totalEarnings
    }));
  };
  const todayTasks = tasks.filter(task => 
    task.completed && 
    task.completedAt && 
    new Date(task.completedAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
  ).length;

  const tabs = [
    { id: 'tasks' as const, name: 'Tareas', icon: Coins },
    { id: 'character' as const, name: 'Personaje', icon: Settings },
    { id: 'pomodoro' as const, name: 'Pomodoro', icon: Clock },
    { id: 'investments' as const, name: 'Inversiones', icon: ShoppingCart },
    { id: 'goals' as const, name: 'Metas', icon: Target },
    { id: 'achievements' as const, name: 'Logros', icon: Trophy },
    { id: 'stats' as const, name: 'Estadísticas', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 ProductiMoney
          </h1>
          <p className="text-gray-600">
            Convierte tu productividad en riqueza virtual
          </p>
          <div className="mt-4 bg-white rounded-lg shadow-md p-4 inline-block">
            <p className="text-lg">
              <span className="text-gray-600">Balance: </span>
              <span className="font-bold text-green-600">{formatCurrency(character.currentBalance)}</span>
              <span className="text-gray-400 ml-2">| Total: {formatCurrency(character.totalEarned)}</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'tasks' && (
            <TaskManager
              tasks={tasks}
              currentStreak={character.currentStreak}
              onTaskComplete={handleTaskComplete}
              onTaskQuantityChange={handleTaskQuantityChange}
              onTaskAdd={handleTaskAdd}
              onTaskDelete={handleTaskDelete}
            />
          )}
          
          {activeTab === 'character' && (
            <CharacterComponent character={character} />
          )}
          
          {activeTab === 'pomodoro' && (
            <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
          )}
          
          {activeTab === 'investments' && (
            <InvestmentShop
              currentBalance={character.currentBalance}
              investments={investments}
              onPurchase={handleInvestmentPurchase}
            />
          )}
          
          {activeTab === 'goals' && (
            <GoalManager
              goals={goals}
              currentBalance={character.currentBalance}
              onGoalAdd={handleGoalAdd}
              onApplyPenalty={handleApplyPenalty}
            />
          )}
          
          {activeTab === 'achievements' && (
            <AchievementsList
              achievements={achievements}
              totalEarned={character.totalEarned}
            />
          )}
          
          {activeTab === 'stats' && (
            <Stats
              dailyStats={dailyStats}
              totalEarned={character.totalEarned}
              currentBalance={character.currentBalance}
              todayTasks={todayTasks}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;