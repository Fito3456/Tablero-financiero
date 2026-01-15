import React from 'react';
import { Target } from 'lucide-react';
import { formatCLP, calcularInteres } from './Utils/storage';

const VistaProyeccion = ({ aportes, tasas, gastosUniversidad }) => {
  const calcularProyeccion = () => {
    let totalRacional = 0;
    let totalTenpoInv = 0;
    let totalBolsillo = 0;
    let totalBanco = 0;
    let totalMercadoPago = 0;

    aportes.forEach(aporte => {
      totalRacional += aporte.racional;
      totalTenpoInv += aporte.tenpoInv;
      totalBolsillo += aporte.bolsilloTenpo;
      totalBanco += aporte.bancoEstado;
      totalMercadoPago += aporte.mercadoPago || 0;
    });

    const valorFinal = 
      calcularInteres(totalRacional, tasas.tasaRacional, 72) +
      calcularInteres(totalTenpoInv, tasas.tasaTenpo, 72) +
      calcularInteres(totalBolsillo, tasas.tasaBolsillo, 72) +
      calcularInteres(totalBanco, tasas.tasaBanco, 72) +
      calcularInteres(totalMercadoPago, tasas.tasaMercadoPago, 72);

    const totalAportado = totalRacional + totalTenpoInv + totalBolsillo + totalBanco + totalMercadoPago;
    const totalGastos = Object.values(gastosUniversidad).reduce((sum, val) => sum + (val || 0), 0);
    const netoDespuesGastos = valorFinal - totalGastos;

    return {
      totalAportado,
      valorFinal,
      ganancia: valorFinal - totalAportado,
      totalGastos,
      netoDespuesGastos,
      cumpleMeta: valorFinal > 0,
      metaActual: 0
    };
  };

  const proyeccion = calcularProyeccion();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Target className="w-8 h-8 text-yellow-400" />
        Proyección 2032
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-400/30">
          <p className="text-blue-200 text-sm mb-2">💰 Total Aportado</p>
          <p className="text-white text-4xl font-bold">{formatCLP(proyeccion.totalAportado)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-400/30">
          <p className="text-green-200 text-sm mb-2">📈 Valor Final</p>
          <p className="text-green-400 text-4xl font-bold">{formatCLP(proyeccion.valorFinal)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-400/30">
          <p className="text-yellow-200 text-sm mb-2">💎 Ganancia</p>
          <p className="text-yellow-400 text-4xl font-bold">{formatCLP(proyeccion.ganancia)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl p-6 border border-red-400/30">
          <p className="text-red-200 text-sm mb-2">🎓 Gastos</p>
          <p className="text-red-400 text-4xl font-bold">{formatCLP(proyeccion.totalGastos)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-400/30 md:col-span-2">
          <p className="text-purple-200 text-sm mb-2">💵 Posible Neto Final</p>
          <p className="text-purple-400 text-5xl font-bold">{formatCLP(proyeccion.netoDespuesGastos)}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-xl p-6 border border-cyan-500/30">
        <h3 className="text-white font-bold text-lg mb-3">📊 Detalles de la Proyección</h3>
        <div className="space-y-2 text-white text-sm">
          <p>• Periodo: 72 meses (Ene 2026 - Dic 2031)</p>
          <p>• Tasas aplicadas: VOO/Tenpo 9%, BancoEstado/Bolsillo/MP 6%</p>
          <p>• Interés compuesto mensual</p>
          <p>• Gastos descontados del valor final</p>
        </div>
      </div>
    </div>
  );
};

export default VistaProyeccion;
