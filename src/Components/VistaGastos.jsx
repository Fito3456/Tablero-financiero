import React from 'react';
import { ShoppingCart, Calendar } from 'lucide-react';
import { storage, formatCLP } from '../utils/storage';

const VistaGastos = ({ gastosUniversidad, setGastosUniversidad }) => {
  // Generar meses de 2026 a 2031
  const generarMeses = () => {
    const meses = [];
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    for (let año = 2026; año <= 2031; año++) {
      for (let mes = 0; mes < 12; mes++) {
        meses.push(`${nombresMeses[mes]} ${año}`);
      }
    }
    return meses;
  };

  const meses = generarMeses();

  const actualizarGasto = async (mes, valor) => {
    const valorLimpio = valor.replace(/[^\d]/g, '');
    const nuevosGastos = { ...gastosUniversidad, [mes]: Number(valorLimpio) || 0 };
    setGastosUniversidad(nuevosGastos);
    
    try {
      await storage.set('gastos-universidad', JSON.stringify(nuevosGastos), true);
    } catch (error) {
      console.error('Error al guardar gastos:', error);
    }
  };

  const totalGastos = Object.values(gastosUniversidad).reduce((sum, val) => sum + (val || 0), 0);
  const mesesConGastos = Object.values(gastosUniversidad).filter(val => val > 0).length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-red-400" />
        Gastos Universidad
      </h2>

      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30 mb-6">
        <p className="text-white text-base font-semibold">
          📚 Transporte • Materiales • Alimentación • Copias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
        {meses.map((mes, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all">
            <label className="block text-purple-200 text-sm mb-2 font-semibold">
              📅 {mes}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 font-semibold">$</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={gastosUniversidad[mes] || ''}
                onChange={(e) => actualizarGasto(mes, e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2 bg-white text-gray-900 rounded-lg border-2 border-red-400 focus:border-red-600 outline-none font-semibold"
              />
            </div>
            {gastosUniversidad[mes] > 0 && (
              <p className="text-red-300 text-xs mt-1 font-semibold">{formatCLP(gastosUniversidad[mes])}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-400/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-100 text-sm mb-1">💰 Total</p>
              <p className="text-white text-4xl font-bold">{formatCLP(totalGastos)}</p>
            </div>
            <ShoppingCart className="w-16 h-16 text-white opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm mb-1">📊 Meses</p>
              <p className="text-white text-4xl font-bold">{mesesConGastos} / 72</p>
            </div>
            <Calendar className="w-16 h-16 text-white opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaGastos;