import React from 'react';
import { TrendingUp, PiggyBank, Wallet, DollarSign, Edit2 } from 'lucide-react';
import { formatCLP } from './Utils/storage';

const VistaActivos = ({ totales, tasas, onEditarTasas }) => {
  const activos = [
    { nombre: 'Racional (VOO)', valor: totales.racional, tasa: tasas.tasaRacional, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { nombre: 'Tenpo Inversión (Steady)', valor: totales.tenpoInv, tasa: tasas.tasaTenpo, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { nombre: 'Bolsillo Tenpo', valor: totales.bolsillo, tasa: tasas.tasaBolsillo, icon: PiggyBank, color: 'from-yellow-500 to-yellow-600' },
    { nombre: 'BancoEstado Premium', valor: totales.banco, tasa: tasas.tasaBanco, icon: Wallet, color: 'from-purple-500 to-purple-600' },
    { nombre: 'Mercado Pago', valor: totales.mercadoPago, tasa: tasas.tasaMercadoPago, icon: DollarSign, color: 'from-cyan-500 to-cyan-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activos.map((activo, idx) => {
          const Icon = activo.icon;
          return (
            <div key={idx} className={`bg-gradient-to-br ${activo.color} rounded-2xl p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all`}>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon className="w-6 h-6" />
                {activo.nombre}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Tasa Anual:</span>
                  <span className="text-white font-bold text-lg">{(activo.tasa * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Valor Actual:</span>
                  <span className="text-white font-bold text-2xl">{formatCLP(activo.valor)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-end bg-gradient-to-r from-purple-600/30 to-purple-700/30 rounded-2xl p-4 border border-purple-500/40 shadow-lg">
        <button
          onClick={onEditarTasas}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Edit2 className="w-5 h-5" />
          Editar Tasas
        </button>
      </div>
    </div>
  );
};

export default VistaActivos;
