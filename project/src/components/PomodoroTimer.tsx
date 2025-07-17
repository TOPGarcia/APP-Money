import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react';
import { formatCurrency } from '../utils/achievements';

interface PomodoroTimerProps {
  onSessionComplete: (earnings: number) => void;
}

export default function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      if (!isBreak) {
        // Work session completed
        const earnings = 10000;
        onSessionComplete(earnings);
        setSessionsCompleted(prev => prev + 1);
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        // Break completed
        setTimeLeft(25 * 60); // Back to 25 minute work session
        setIsBreak(false);
      }
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, onSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <Clock className="text-red-500" />
          Pomodoro Timer
        </h2>

        {/* Timer Display */}
        <div className={`relative w-48 h-48 mx-auto mb-6 rounded-full border-8 ${
          isBreak ? 'border-green-200' : 'border-red-200'
        } flex items-center justify-center`}>
          <div 
            className={`absolute inset-0 rounded-full ${
              isBreak ? 'border-green-500' : 'border-red-500'
            } border-8 border-transparent`}
            style={{
              background: `conic-gradient(${isBreak ? '#22C55E' : '#EF4444'} ${progress * 3.6}deg, transparent 0deg)`
            }}
          ></div>
          <div className="text-center z-10">
            <div className={`text-4xl font-bold ${isBreak ? 'text-green-600' : 'text-red-600'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {isBreak ? (
                <div className="flex items-center gap-1 justify-center">
                  <Coffee size={16} />
                  Descanso
                </div>
              ) : (
                'Enfoque'
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isBreak
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-300 hover:bg-gray-400 text-gray-700 transition-all duration-200 hover:scale-105"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Sesiones Hoy</p>
            <p className="text-2xl font-bold text-blue-600">{sessionsCompleted}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Ganado Hoy</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(sessionsCompleted * 10000)}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-gray-800 mb-2">🍅 Técnica Pomodoro</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 25 min de trabajo concentrado = {formatCurrency(10000)}</li>
            <li>• 5 min de descanso obligatorio</li>
            <li>• Elimina distracciones durante el timer</li>
            <li>• Cada sesión completa suma a tu progreso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}