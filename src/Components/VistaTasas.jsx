import React from 'react';
import { Edit2 } from 'lucide-react';
import { storage } from '../utils/storage';

const VistaTasas = ({ tasas, setTasas }) => {
  const campos = [
    { nombre: 'Racional (VOO)', key: 'tasaRacional', icon: '📈', color: 'green' },
    { nombre: 'Tenpo Inversión (Steady)', key: 'tasaTenpo', icon: '📈', color: 'blue' },
    { nombre: 'Bolsillo Tenpo', key: 'tasaBolsillo', icon: '🦊', color: 'yellow' },
    { nombre: 'BancoEstado Premium', key: 'tasaBanco', icon: '💼', color: 'purple' },
    { nombre: 'Mercado Pago', key: 'tasaMercadoPago', icon: '💰', color: 'cyan' }
  ];

  const restaurarDefecto = async () => {
    if (!window.confirm('¿Restaurar tasas a valores por defecto?')) return;
    
    setTasas.setTasaRacional(0.09);
    setTasas.setTasaTenpo(0.09);
    setTasas.setTasaBolsillo(0.06);
    setTasas.setTasaBanco(0.06);
    setTasas.setTasaMercadoPago(0.06);
    
    try {
      await storage.set('tasas-interes', JSON.stringify({
        racional: 0.09,
        tenpo: 0.09,
        bolsillo: 0.06,
        banco: 0.06,
        mercadoPago: 0.06
      }));
      alert('✅ Tasas restauradas');
    } catch (error) {
      console.error('Error al restaurar:', error);
    }
  };

  const guardarTasa = async (key, valor) => {
    const setters = {
      tasaRacional: setTasas.setTasaRacional,
      tasaTenpo: setTasas.setTasaTenpo,
      tasaBolsillo: setTasas.setTasaBolsillo,
      tasaBanco: setTasas.setTasaBanco,
      tasaMercadoPago: setTasas.setTasaMercadoPago
    };
    
    setters[key](Number(valor) / 100);
    
    try {
      const nuevasTasas = {
        racional: key === 'tasaRacional' ? Number(valor) / 100 : tasas.tasaRacional,
        tenpo: key === 'tasaTenpo' ? Number(valor) / 100 : tasas.tasaTenpo,
        bolsillo: key === 'tasaBolsillo' ? Number(valor) / 100 : tasas.tasaBolsillo,
        banco: key === 'tasaBanco' ? Number(valor) / 100 : tasas.tasaBanco,
        mercadoPago: key === 'tasaMercadoPago' ? Number(valor) / 100 : tasas.tasaMercadoPago
      };
      await storage.set('tasas-interes', JSON.stringify(nuevasTasas));
    } catch (error) {
      console.error('Error al guardar tasa:', error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Edit2 className="w-8 h-8 text-yellow-400" />
        Tasas de Interés
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {campos.map((campo, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all">
            <label className="block text-purple-200 text-sm mb-2 font-semibold">
              {campo.icon} {campo.nombre}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                step="0.01"
                value={(tasas[campo.key] * 100).toFixed(2)}
                onChange={(e) => guardarTasa(campo.key, e.target.value)}
                className={`flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-${campo.color}-400 focus:border-${campo.color}-600 outline-none text-xl font-bold`}
              />
              <span className="text-white text-2xl font-bold">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30 mb-6">
        <p className="text-white text-sm">
          ℹ️ Los cambios se aplican automáticamente. Tasas anuales calculadas mensualmente.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={restaurarDefecto}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🔄 Valores por Defecto
        </button>
      </div>
    </div>
  );
};

export default VistaTasas;