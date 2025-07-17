import React from 'react';
import { ShoppingCart, TrendingUp, CheckCircle } from 'lucide-react';
import { Investment } from '../types';
import { formatCurrency, INVESTMENTS } from '../utils/achievements';

interface InvestmentShopProps {
  currentBalance: number;
  investments: Investment[];
  onPurchase: (investment: Investment) => void;
}

export default function InvestmentShop({ currentBalance, investments, onPurchase }: InvestmentShopProps) {
  const dailyPassiveIncome = investments
    .filter(inv => inv.owned)
    .reduce((total, inv) => total + inv.dailyReturn, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="text-green-500" />
          Tienda de Inversiones
        </h2>
        {dailyPassiveIncome > 0 && (
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <TrendingUp className="mx-auto text-green-600 mb-1" size={20} />
            <p className="text-sm text-green-700 font-medium">Ingresos Pasivos</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(dailyPassiveIncome)}/día
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INVESTMENTS.map((investment) => {
          const owned = investments.find(inv => inv.id === investment.id)?.owned || false;
          const canAfford = currentBalance >= investment.cost;
          const roi = ((investment.dailyReturn * 365) / investment.cost * 100).toFixed(1);

          return (
            <div 
              key={investment.id}
              className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                owned 
                  ? 'border-green-300 bg-green-50' 
                  : canAfford 
                    ? 'border-blue-300 bg-blue-50 hover:shadow-lg' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{investment.icon}</span>
                  <div>
                    <h3 className={`font-semibold ${owned ? 'text-green-800' : 'text-gray-800'}`}>
                      {investment.name}
                    </h3>
                    <p className="text-sm text-gray-600">{investment.description}</p>
                  </div>
                </div>
                {owned && (
                  <CheckCircle className="text-green-500" size={24} />
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Costo:</span>
                  <span className="font-bold">{formatCurrency(investment.cost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Retorno diario:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(investment.dailyReturn)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ROI anual:</span>
                  <span className="font-bold text-blue-600">{roi}%</span>
                </div>
              </div>

              {!owned && (
                <button
                  onClick={() => onPurchase(investment)}
                  disabled={!canAfford}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    canAfford
                      ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Comprar' : 'Fondos Insuficientes'}
                </button>
              )}

              {owned && (
                <div className="bg-green-100 rounded-lg p-2 text-center">
                  <p className="text-sm text-green-700 font-medium">¡Inversión Activa!</p>
                  <p className="text-xs text-green-600">
                    Generando {formatCurrency(investment.dailyReturn)} diarios
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Estrategia de Inversión</h3>
        <p className="text-sm text-blue-700">
          Las inversiones generan ingresos pasivos diarios que se suman automáticamente a tu balance. 
          Prioriza inversiones con mejor ROI para maximizar tus ganancias a largo plazo.
        </p>
      </div>
    </div>
  );
}