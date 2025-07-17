import React from 'react';
import { Trophy, Lock, Star } from 'lucide-react';
import { Achievement } from '../types';
import { formatCurrency } from '../utils/achievements';

interface AchievementsListProps {
  achievements: Achievement[];
  totalEarned: number;
}

export default function AchievementsList({ achievements, totalEarned }: AchievementsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-500" />
        Logros
      </h2>
      
      <div className="grid gap-4">
        {achievements.map((achievement) => {
          const isUnlocked = totalEarned >= achievement.requiredAmount;
          const progress = Math.min((totalEarned / achievement.requiredAmount) * 100, 100);
          
          return (
            <div 
              key={achievement.id} 
              className={`rounded-lg p-4 border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'border-yellow-300 bg-yellow-50 transform hover:scale-105' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  isUnlocked ? 'bg-yellow-400' : 'bg-gray-300'
                }`}>
                  {isUnlocked ? (
                    <Star className="text-white" size={20} />
                  ) : (
                    <Lock className="text-gray-600" size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isUnlocked ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    isUnlocked ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Objetivo: {formatCurrency(achievement.requiredAmount)}
                  </p>
                  
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Progreso: {Math.round(progress)}%
                      </p>
                    </div>
                  )}
                  
                  {isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Desbloqueado el {new Date(achievement.unlockedAt).toLocaleDateString('es-CL')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}