import React from 'react';
import { User, Home, Car, Crown, Gem, Star, Building, Plane } from 'lucide-react';
import { Character as CharacterType } from '../types';
import { formatCurrency } from '../utils/achievements';

interface CharacterProps {
  character: CharacterType;
}

// Character Avatar Component
const CharacterAvatar = ({ appearance }: { appearance: string }) => {
  const avatarStyles = {
    poor: "👤",
    working: "👔",
    middle: "🏠",
    wealthy: "🚗",
    rich: "👑",
    millionaire: "💎"
  };

  const backgroundColors = {
    poor: "from-gray-400 to-gray-600",
    working: "from-blue-400 to-blue-600", 
    middle: "from-green-400 to-green-600",
    wealthy: "from-yellow-400 to-yellow-600",
    rich: "from-purple-400 to-purple-600",
    millionaire: "from-pink-400 to-pink-600"
  };

  return (
    <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${backgroundColors[appearance as keyof typeof backgroundColors]} flex items-center justify-center shadow-2xl transform transition-all duration-1000 hover:scale-110`}>
      <div className="text-6xl animate-pulse">
        {avatarStyles[appearance as keyof typeof avatarStyles]}
      </div>
      {/* Sparkle effect for wealthy characters */}
      {['wealthy', 'rich', 'millionaire'].includes(appearance) && (
        <>
          <div className="absolute -top-2 -right-2 text-yellow-300 animate-bounce">✨</div>
          <div className="absolute -bottom-2 -left-2 text-yellow-300 animate-bounce delay-300">✨</div>
          <div className="absolute top-1/2 -left-4 text-yellow-300 animate-bounce delay-150">⭐</div>
        </>
      )}
    </div>
  );
};

const CHARACTER_CONFIGS = {
  poor: {
    icon: User,
    title: 'Empezando el Viaje',
    bgColor: 'bg-gray-500',
    textColor: 'text-gray-600',
    description: 'Cada gran fortuna comenzó con un pequeño paso.',
    environment: '🏚️ Casa humilde',
  },
  working: {
    icon: User,
    title: 'Trabajador Dedicado',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-600',
    description: 'El trabajo constante está dando frutos.',
    environment: '🏠 Apartamento',
  },
  middle: {
    icon: Home,
    title: 'Clase Media',
    bgColor: 'bg-green-500',
    textColor: 'text-green-600',
    description: 'Has alcanzado estabilidad financiera.',
    environment: '🏡 Casa propia',
  },
  wealthy: {
    icon: Car,
    title: 'Persona Adinerada',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    description: 'Tu dedicación te ha llevado lejos.',
    environment: '🏘️ Casa en barrio exclusivo',
  },
  rich: {
    icon: Crown,
    title: 'Rico',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-600',
    description: 'Eres una inspiración para otros.',
    environment: '🏰 Mansión',
  },
  millionaire: {
    icon: Gem,
    title: 'Millonario',
    bgColor: 'bg-pink-500',
    textColor: 'text-pink-600',
    description: '¡Has alcanzado la cúspide del éxito!',
    environment: '🏝️ Isla privada',
  }
};

export default function Character({ character }: CharacterProps) {
  const config = CHARACTER_CONFIGS[character.appearance as keyof typeof CHARACTER_CONFIGS];
  const Icon = config.icon;

  const progressToNext = () => {
    const levels = [0, 100000, 500000, 1000000, 2000000, 5000000];
    const currentLevelIndex = levels.findIndex(level => character.totalEarned < level);
    
    if (currentLevelIndex === -1) return 100; // Max level
    if (currentLevelIndex === 0) return 0; // First level
    
    const currentMin = levels[currentLevelIndex - 1];
    const nextTarget = levels[currentLevelIndex];
    const progress = ((character.totalEarned - currentMin) / (nextTarget - currentMin)) * 100;
    
    return Math.min(progress, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        <CharacterAvatar appearance={character.appearance} />
        
        <h2 className={`text-2xl font-bold ${config.textColor} mb-2 mt-4`}>
          {config.title}
        </h2>
        
        <p className="text-gray-600 mb-4 italic">
          "{config.description}"
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progreso al siguiente nivel</span>
            <span className="text-sm font-bold text-gray-800">{Math.round(progressToNext())}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${config.bgColor} transition-all duration-1000 ease-out`}
              style={{ width: `${progressToNext()}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Total Ganado</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(character.totalEarned)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Balance Actual</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(character.currentBalance)}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm text-gray-600">Entorno actual</p>
          <p className="text-lg">{config.environment}</p>
        </div>
      </div>
    </div>
  );
}