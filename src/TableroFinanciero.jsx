import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PiggyBank, Target, Calendar, Wallet, Edit2, Save, ShoppingCart } from 'lucide-react';

// ============ SISTEMA DE ALMACENAMIENTO UNIVERSAL ============
const storage = {
  async get(key, shared = false) {
    // Si estamos en Web, usar window.storage
    if (window.storage) {
      try {
        return await window.storage.get(key, shared);
      } catch (error) {
        console.log('No existe la clave:', key);
        return null;
      }
    }
    // Si estamos en local, usar localStorage
    else {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    }
  },

  async set(key, value, shared = false) {
    // Si estamos en Web, usar window.storage
    if (window.storage) {
      try {
        return await window.storage.set(key, value, shared);
      } catch (error) {
        console.error('Error guardando en window.storage:', error);
        return null;
      }
    }
    // Si estamos en local, usar localStorage
    else {
      try {
        localStorage.setItem(key, value);
        return { key, value };
      } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return null;
      }
    }
  },

  async delete(key, shared = false) {
    // Si estamos en Web , usar window.storage
    if (window.storage) {
      try {
        return await window.storage.delete(key, shared);
      } catch (error) {
        console.error('Error eliminando en window.storage:', error);
        return null;
      }
    }
    // Si estamos en local, usar localStorage
    else {
      try {
        localStorage.removeItem(key);
        return { key, deleted: true };
      } catch (error) {
        console.error('Error eliminando en localStorage:', error);
        return null;
      }
    }
  }
};

// ============ COMPONENTE: Header ============
const Header = ({ fechaHoraChile, onCrearRespaldo, onRestaurarRespaldo, onResetear }) => {
  const formatearFechaHora = () => {
    const opciones = {
      timeZone: 'America/Santiago',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return fechaHoraChile.toLocaleString('es-CL', opciones);
  };

  return (
    <div className="text-center mb-8">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-20 blur-3xl animate-pulse"></div>
        <h1 className="relative text-5xl md:text-7xl font-black mb-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl animate-[pulse_3s_ease-in-out_infinite]" style={{
          fontFamily: "'Poppins', 'Inter', sans-serif",
          letterSpacing: '0.05em',
          textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(168,85,247,0.2)'
        }}>
          💰 TABLERO FINANCIERO
        </h1>
        <div className="relative flex items-center justify-center gap-3 mb-2">
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-300 bg-clip-text text-transparent" style={{
            fontFamily: "'Poppins', sans-serif",
            textShadow: '0 0 20px rgba(255,255,255,0.2)'
          }}>
            RENATO
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
        </div>
        <p className="relative text-purple-200 text-lg font-semibold tracking-wide">
          ✨ 2026-2032 • Crecimiento Inteligente ✨
        </p>
      </div>
      
      <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 inline-block shadow-xl">
        <p className="text-white text-xl font-semibold">🇨🇱 {formatearFechaHora()}</p>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={onCrearRespaldo}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Save className="w-5 h-5" />
          💾 Respaldo
        </button>
        <button
          onClick={onRestaurarRespaldo}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          📥 Restaurar
        </button>
        <button
          onClick={onResetear}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🗑️ Reset
        </button>
      </div>
    </div>
  );
};

// ============ COMPONENTE: Vista Cronograma ============
const VistaCronograma = ({ aportes, setAportes, mesesCompletados, setMesesCompletados }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const toggleCompletado = async (index) => {
    const nuevosCompletados = new Set(mesesCompletados);
    if (nuevosCompletados.has(index)) {
      nuevosCompletados.delete(index);
    } else {
      nuevosCompletados.add(index);
    }
    setMesesCompletados(nuevosCompletados);
    
    try {
      // COMPARTIDO: true para sincronizar entre todos los usuarios
      await storage.set('meses-completados', JSON.stringify([...nuevosCompletados]), true);
    } catch (error) {
      console.error('Error al guardar meses completados:', error);
    }
  };

  const actualizarAporte = async (index, campo, valor) => {
    const nuevosAportes = [...aportes];
    nuevosAportes[index][campo] = Number(valor) || 0;
    setAportes(nuevosAportes);

    try {
      // COMPARTIDO: true para sincronizar entre todos los usuarios
      await storage.set('aportes-cronograma', JSON.stringify(nuevosAportes), true);
    } catch (error) {
      console.error('Error al guardar aportes:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto" style={{fontFamily: 'Courier New, monospace'}}>
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-6 mb-6">
        <div className="text-3xl font-bold text-gray-800 mb-2">═══════════════════════</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">PLAN DE AHORRO E INVERSIÓN</h2>
        <p className="text-sm text-gray-600">RENATO - CHILE 🇨🇱</p>
        <p className="text-xs text-gray-500 mt-2">Inicio: 25 de Enero 2026 - Fin: Diciembre 2031</p>
        <div className="text-3xl font-bold text-gray-800 mt-2">═══════════════════════</div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setModoEdicion(!modoEdicion)}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg transform hover:scale-105 ${
            modoEdicion
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
          }`}
        >
          {modoEdicion ? (
            <>
              <Save className="w-5 h-5" />
              GUARDAR CAMBIOS
            </>
          ) : (
            <>
              <Edit2 className="w-5 h-5" />
              MODO EDICIÓN
            </>
          )}
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto bg-gray-50 p-4 rounded border-2 border-gray-300">
        {aportes.map((aporte, idx) => {
          const total = aporte.racional + aporte.tenpoInv + aporte.bolsilloTenpo + aporte.bancoEstado + (aporte.mercadoPago || 0);
          const estaCompletado = mesesCompletados.has(idx);
          
          return (
            <div key={idx} className={`mb-4 pb-4 border-b border-dashed border-gray-300 ${estaCompletado ? 'bg-green-50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCompletado(idx)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      estaCompletado
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'border-gray-400 hover:border-green-500'
                    }`}
                  >
                    {estaCompletado && '✓'}
                  </button>
                  <span className={`font-bold text-lg ${estaCompletado ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                    {aporte.fecha}
                  </span>
                </div>
                <span className={`text-xl font-bold ${estaCompletado ? 'text-green-600' : 'text-gray-900'}`}>
                  {formatCLP(total)}
                </span>
              </div>

              <div className="pl-9 space-y-1 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>• Racional (VOO):</span>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={aporte.racional}
                      onChange={(e) => actualizarAporte(idx, 'racional', e.target.value)}
                      className="w-32 px-2 py-1 bg-white text-gray-900 rounded border border-gray-300 focus:border-blue-500 outline-none text-right"
                    />
                  ) : (
                    <span className="font-semibold">{formatCLP(aporte.racional)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>• Tenpo Inversión:</span>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={aporte.tenpoInv}
                      onChange={(e) => actualizarAporte(idx, 'tenpoInv', e.target.value)}
                      className="w-32 px-2 py-1 bg-white text-gray-900 rounded border border-gray-300 focus:border-blue-500 outline-none text-right"
                    />
                  ) : (
                    <span className="font-semibold">{formatCLP(aporte.tenpoInv)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>• Bolsillo Tenpo:</span>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={aporte.bolsilloTenpo}
                      onChange={(e) => actualizarAporte(idx, 'bolsilloTenpo', e.target.value)}
                      className="w-32 px-2 py-1 bg-white text-gray-900 rounded border border-gray-300 focus:border-blue-500 outline-none text-right"
                    />
                  ) : (
                    <span className="font-semibold">{formatCLP(aporte.bolsilloTenpo)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>• BancoEstado:</span>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={aporte.bancoEstado}
                      onChange={(e) => actualizarAporte(idx, 'bancoEstado', e.target.value)}
                      className="w-32 px-2 py-1 bg-white text-gray-900 rounded border border-gray-300 focus:border-blue-500 outline-none text-right"
                    />
                  ) : (
                    <span className="font-semibold">{formatCLP(aporte.bancoEstado)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>• Mercado Pago:</span>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={aporte.mercadoPago || 0}
                      onChange={(e) => actualizarAporte(idx, 'mercadoPago', e.target.value)}
                      className="w-32 px-2 py-1 bg-white text-gray-900 rounded border border-gray-300 focus:border-blue-500 outline-none text-right"
                    />
                  ) : (
                    <span className="font-semibold">{formatCLP(aporte.mercadoPago || 0)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 border-dashed border-gray-400 mt-6 pt-6 text-center">
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span>COMPLETADOS:</span>
          <span className="font-bold">{mesesCompletados.size} / 72</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
          <span>PROGRESO:</span>
          <span className="text-green-600">{((mesesCompletados.size / 72) * 100).toFixed(1)}%</span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-2">═══════════════════════</div>
        <p className="text-xs text-gray-500">🎯 Disciplina financiera</p>
        <div className="text-3xl font-bold text-gray-800 mt-2">═══════════════════════</div>
      </div>
    </div>
  );
};

// ============ COMPONENTE: Vista Tasas ============
const VistaTasas = ({ tasas, setTasas }) => {
  const campos = [
    { nombre: 'Racional (VOO)', key: 'tasaRacional', icon: '📈', color: 'green' },
    { nombre: 'Tenpo Inversión (Steady)', key: 'tasaTenpo', icon: '📈', color: 'blue' },
    { nombre: 'Bolsillo Tenpo', key: 'tasaBolsillo', icon: '🏦', color: 'yellow' },
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
          Los cambios se aplican automáticamente. Tasas anuales calculadas mensualmente.
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

// ============ COMPONENTE: Indicadores Dólar ============
const IndicadoresDolar = ({ dolarReal, dolarSimulado, tasaDolar, onActualizarDolar }) => {
  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm mb-1">💹 Dólar Real USD/CLP</p>
            <p className="text-white text-4xl font-bold">{formatCLP(dolarReal)}</p>
            <p className="text-green-200 text-xs mt-2">Actualizado cada 5 min</p>
            <button
              onClick={onActualizarDolar}
              className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-all shadow-lg"
            >
              🔄 Actualizar ahora
            </button>
          </div>
          <DollarSign className="w-16 h-16 text-white opacity-50" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">🎲 Dólar Simulado</p>
            <p className="text-white text-4xl font-bold">{formatCLP(dolarSimulado)}</p>
            <div className={`mt-2 text-sm font-semibold ${tasaDolar >= 0 ? 'text-blue-200' : 'text-red-200'}`}>
              {tasaDolar >= 0 ? '↑' : '↓'} {Math.abs(tasaDolar).toFixed(2)} CLP
            </div>
          </div>
          <DollarSign className="w-16 h-16 text-white opacity-50" />
        </div>
      </div>
    </div>
  );
};

// ============ COMPONENTE: Navegación ============
const Navegacion = ({ vistaActual, onCambiarVista }) => {
  const vistas = [
    { id: 'resumen', icon: '📊', label: 'Resumen' },
    { id: 'activos', icon: '💼', label: 'Activos' },
    { id: 'gastos', icon: '🎓', label: 'Gastos Universidad' },
    { id: 'proyeccion', icon: '🎯', label: 'Proyección 2032' },
    { id: 'aportes', icon: '📅', label: 'Cronograma' },
    { id: 'tasas', icon: '📈', label: 'Editar Tasas' }
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {vistas.map(vista => (
        <button
          key={vista.id}
          onClick={() => onCambiarVista(vista.id)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap shadow-lg ${
            vistaActual === vista.id
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white scale-105 shadow-xl'
              : 'bg-white/10 text-purple-200 hover:bg-white/20 hover:scale-105'
          }`}
        >
          {vista.icon} {vista.label}
        </button>
      ))}
    </div>
  );
};

// ============ COMPONENTE: Vista Resumen ============
const VistaResumen = ({ totales, ganancia, rentabilidad, gastosAnuales }) => {
  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 border border-blue-400/30 shadow-xl transform hover:scale-105 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <Wallet className="w-8 h-8 text-white" />
          <p className="text-blue-100 text-sm">Total Invertido</p>
        </div>
        <p className="text-white text-3xl font-bold">{formatCLP(totales.invertido)}</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 border border-green-400/30 shadow-xl transform hover:scale-105 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-8 h-8 text-white" />
          <p className="text-green-100 text-sm">Valor Actual</p>
        </div>
        <p className="text-white text-3xl font-bold">{formatCLP(totales.valorActual)}</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 border border-yellow-400/30 shadow-xl transform hover:scale-105 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <PiggyBank className="w-8 h-8 text-white" />
          <p className="text-yellow-100 text-sm">Ganancia Neta</p>
        </div>
        <p className="text-white text-3xl font-bold">{formatCLP(ganancia)}</p>
        <p className="text-yellow-100 text-sm mt-1 font-semibold">+{rentabilidad}%</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 border border-purple-400/30 shadow-xl transform hover:scale-105 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-8 h-8 text-white" />
          <p className="text-purple-100 text-sm">Meses Completados</p>
        </div>
        <p className="text-white text-3xl font-bold">{totales.mesesContados}</p>
        <p className="text-purple-100 text-sm mt-1">de 72 meses</p>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 border border-red-400/30 shadow-xl transform hover:scale-105 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <ShoppingCart className="w-8 h-8 text-white" />
          <p className="text-red-100 text-sm">Gastos Universidad</p>
        </div>
        <p className="text-white text-3xl font-bold">{formatCLP(gastosAnuales.total)}</p>
        <p className="text-red-100 text-sm mt-1">{gastosAnuales.mesesGastados} meses</p>
      </div>
    </div>
  );
};

// ============ COMPONENTE: Vista Activos ============
const VistaActivos = ({ totales, tasas, onEditarTasas }) => {
  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

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

// ============ COMPONENTE: Vista Gastos Universidad ============
const VistaGastos = ({ gastosUniversidad, setGastosUniversidad }) => {
  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

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

// ============ COMPONENTE: Vista Proyección ============
const VistaProyeccion = ({ aportes, tasas, gastosUniversidad }) => {
  const formatCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const calcularInteres = (capital, tasa, meses) => {
    return capital * Math.pow(1 + tasa/12, meses);
  };

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
          <p className="text-purple-200 text-sm mb-2">💵 Posible Neto Final </p>
          <p className="text-purple-400 text-5xl font-bold">{formatCLP(proyeccion.netoDespuesGastos)}</p>
        </div>
      </div>
    </div>
  );
};

// ============ COMPONENTE PRINCIPAL ============
const TableroFinanciero = () => {
  const [dolarSimulado, setDolarSimulado] = useState(950);
  const [tasaDolar, setTasaDolar] = useState(0);
  const [dolarReal, setDolarReal] = useState(888);
  const [vistaActual, setVistaActual] = useState('resumen');
  const [fechaHoraChile, setFechaHoraChile] = useState(new Date());
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  // Tasas de interés
  const [tasaRacional, setTasaRacional] = useState(0.09);
  const [tasaTenpo, setTasaTenpo] = useState(0.09);
  const [tasaBolsillo, setTasaBolsillo] = useState(0.06);
  const [tasaBanco, setTasaBanco] = useState(0.06);
  const [tasaMercadoPago, setTasaMercadoPago] = useState(0.06);

  // Gastos universidad
  const [gastosUniversidad, setGastosUniversidad] = useState({});

  // Aportes y meses completados
  const [aportes, setAportes] = useState([]);
  const [mesesCompletados, setMesesCompletados] = useState(new Set());

  // Cargar datos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar tasas
        const tasasData = await storage.get('tasas-interes');
        if (tasasData) {
          const tasas = JSON.parse(tasasData.value);
          setTasaRacional(tasas.racional || 0.09);
          setTasaTenpo(tasas.tenpo || 0.09);
          setTasaBolsillo(tasas.bolsillo || 0.06);
          setTasaBanco(tasas.banco || 0.06);
          setTasaMercadoPago(tasas.mercadoPago || 0.06);
        }

        // Cargar gastos universidad (COMPARTIDO)
        const gastosData = await storage.get('gastos-universidad', true);
        if (gastosData) {
          setGastosUniversidad(JSON.parse(gastosData.value));
        }

        // Cargar meses completados (COMPARTIDO)
        const mesesData = await storage.get('meses-completados', true);
        if (mesesData) {
          setMesesCompletados(new Set(JSON.parse(mesesData.value)));
        }

        // Cargar aportes (COMPARTIDO)
        const aportesData = await storage.get('aportes-cronograma', true);
        if (aportesData) {
          setAportes(JSON.parse(aportesData.value));
        } else {
          setAportes(generarAportesIniciales());
        }
      } catch (error) {
        console.log('Usando valores por defecto');
        setAportes(generarAportesIniciales());
      }
      setCargandoDatos(false);
    };
    cargarDatos();
  }, []);

  // Continúa en la siguiente parte...
  
  const generarAportesIniciales = () => {
    const aportes = [];
    
    aportes.push({
      fecha: 'Ene 2026',
      racional: 10000,
      tenpoInv: 18000,
      bolsilloTenpo: 0,
      bancoEstado: 0,
      mercadoPago: 0
    });

    for (let i = 1; i < 12; i++) {
      aportes.push({
        fecha: `${['Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i-1]} 2026`,
        racional: 2000,
        tenpoInv: 2000,
        bolsilloTenpo: i === 5 ? 50000 : 0,
        bancoEstado: i === 6 ? 30000 : 0,
        mercadoPago: 0
      });
    }

    for (let año = 2027; año <= 2031; año++) {
      for (let mes = 0; mes < 12; mes++) {
        aportes.push({
          fecha: `${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][mes]} ${año}`,
          racional: 10000,
          tenpoInv: 10000,
          bolsilloTenpo: 0,
          bancoEstado: 0,
          mercadoPago: 0
        });
      }
    }

    return aportes;
  };

  const calcularInteres = (capital, tasa, meses) => {
    return capital * Math.pow(1 + tasa/12, meses);
  };

  const calcularTotales = () => {
    let totalRacional = 0;
    let totalTenpoInv = 0;
    let totalBolsillo = 0;
    let totalBanco = 0;
    let totalMercadoPago = 0;
    let mesesContados = 0;

    aportes.forEach((aporte, idx) => {
      if (mesesCompletados.has(idx)) {
        totalRacional += aporte.racional;
        totalTenpoInv += aporte.tenpoInv;
        totalBolsillo += aporte.bolsilloTenpo;
        totalBanco += aporte.bancoEstado;
        totalMercadoPago += aporte.mercadoPago || 0;
        mesesContados++;
      }
    });

    const valorRacional = calcularInteres(totalRacional, tasaRacional, mesesContados);
    const valorTenpoInv = calcularInteres(totalTenpoInv, tasaTenpo, mesesContados);
    const valorBolsillo = calcularInteres(totalBolsillo, tasaBolsillo, mesesContados);
    const valorBanco = calcularInteres(totalBanco, tasaBanco, mesesContados);
    const valorMercadoPago = calcularInteres(totalMercadoPago, tasaMercadoPago, mesesContados);

    return {
      invertido: totalRacional + totalTenpoInv + totalBolsillo + totalBanco + totalMercadoPago,
      valorActual: valorRacional + valorTenpoInv + valorBolsillo + valorBanco + valorMercadoPago,
      racional: valorRacional,
      tenpoInv: valorTenpoInv,
      bolsillo: valorBolsillo,
      banco: valorBanco,
      mercadoPago: valorMercadoPago,
      mesesContados: mesesContados
    };
  };

  const calcularGastosAnuales = () => {
    let total = 0;
    let mesesGastados = 0;
    Object.values(gastosUniversidad).forEach(gasto => {
      if (gasto) {
        total += gasto;
        mesesGastados++;
      }
    });
    return { total, mesesGastados };
  };

  const totales = calcularTotales();
  const gastosAnuales = calcularGastosAnuales();
  const ganancia = totales.valorActual - totales.invertido;
  const rentabilidad = totales.invertido > 0 ? ((ganancia / totales.invertido) * 100).toFixed(2) : 0;

  // Funciones para respaldos
  const crearRespaldo = async () => {
    try {
      const respaldo = {
        tasas: { racional: tasaRacional, tenpo: tasaTenpo, bolsillo: tasaBolsillo, banco: tasaBanco, mercadoPago: tasaMercadoPago },
        aportes,
        mesesCompletados: [...mesesCompletados],
        gastosUniversidad,
        fecha: new Date().toISOString()
      };
      await storage.set('respaldo-completo', JSON.stringify(respaldo));
      alert('✅ Respaldo creado exitosamente!');
    } catch (error) {
      alert('❌ Error al crear respaldo');
    }
  };

  const restaurarRespaldo = async () => {
    if (!window.confirm('¿Estás seguro de restaurar el último respaldo?')) return;
    try {
      const data = await storage.get('respaldo-completo');
      if (data) {
        const respaldo = JSON.parse(data.value);
        setTasaRacional(respaldo.tasas.racional);
        setTasaTenpo(respaldo.tasas.tenpo);
        setTasaBolsillo(respaldo.tasas.bolsillo);
        setTasaBanco(respaldo.tasas.banco);
        setTasaMercadoPago(respaldo.tasas.mercadoPago);
        setAportes(respaldo.aportes);
        setMesesCompletados(new Set(respaldo.mesesCompletados));
        setGastosUniversidad(respaldo.gastosUniversidad || {});
        alert(`✅ Respaldo restaurado!`);
      } else {
        alert('⚠️ No hay respaldos disponibles');
      }
    } catch (error) {
      alert('❌ Error al restaurar');
    }
  };

  const resetearTodo = async () => {
    if (!window.confirm('⚠️ ¿Borrar TODOS los datos?')) return;
    if (!window.confirm('¿REALMENTE estás seguro?')) return;
    
    try {
      setTasaRacional(0.09);
      setTasaTenpo(0.09);
      setTasaBolsillo(0.06);
      setTasaBanco(0.06);
      setTasaMercadoPago(0.06);
      setAportes(generarAportesIniciales());
      setMesesCompletados(new Set());
      setGastosUniversidad({});
      
      await storage.delete('tasas-interes', false);
      await storage.delete('aportes-cronograma', true);
      await storage.delete('meses-completados', true);
      await storage.delete('respaldo-completo', false);
      await storage.delete('gastos-universidad', true);
      
      alert('✅ Datos reseteados');
    } catch (error) {
      alert('❌ Error al resetear');
    }
  };

  const obtenerDolarReal = async () => {
    try {
      const response = await fetch('https://mindicador.cl/api/dolar');
      const data = await response.json();
      if (data.serie?.[0]?.valor) {
        setDolarReal(data.serie[0].valor);
        return;
      }
    } catch (error) {
      console.log('Error con mindicador.cl');
    }
  };

  const actualizarDolarSimulado = () => {
    const variacion = (Math.random() - 0.5) * 20;
    const nuevoDolar = Math.max(800, Math.min(1100, dolarSimulado + variacion));
    setDolarSimulado(nuevoDolar);
    setTasaDolar(variacion);
  };

  useEffect(() => {
    obtenerDolarReal();
    const intervalReal = setInterval(obtenerDolarReal, 300000);
    const intervalSimulado = setInterval(actualizarDolarSimulado, 5000);
    const intervalFecha = setInterval(() => setFechaHoraChile(new Date()), 1000);
    return () => {
      clearInterval(intervalReal);
      clearInterval(intervalSimulado);
      clearInterval(intervalFecha);
    };
  }, [dolarSimulado]);

  if (cargandoDatos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          fechaHoraChile={fechaHoraChile}
          onCrearRespaldo={crearRespaldo}
          onRestaurarRespaldo={restaurarRespaldo}
          onResetear={resetearTodo}
        />
        
        <IndicadoresDolar
          dolarReal={dolarReal}
          dolarSimulado={dolarSimulado}
          tasaDolar={tasaDolar}
          onActualizarDolar={obtenerDolarReal}
        />
        
        <Navegacion
          vistaActual={vistaActual}
          onCambiarVista={setVistaActual}
        />
        
        {vistaActual === 'resumen' && (
          <VistaResumen
            totales={totales}
            ganancia={ganancia}
            rentabilidad={rentabilidad}
            gastosAnuales={gastosAnuales}
          />
        )}

        {vistaActual === 'activos' && (
          <VistaActivos totales={totales} tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} onEditarTasas={() => setVistaActual('tasas')} />
        )}

        {vistaActual === 'gastos' && (
          <VistaGastos gastosUniversidad={gastosUniversidad} setGastosUniversidad={setGastosUniversidad} />
        )}

        {vistaActual === 'proyeccion' && (
          <VistaProyeccion aportes={aportes} tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} gastosUniversidad={gastosUniversidad} />
        )}

        {vistaActual === 'aportes' && (
          <VistaCronograma aportes={aportes} setAportes={setAportes} mesesCompletados={mesesCompletados} setMesesCompletados={setMesesCompletados} />
        )}

        {vistaActual === 'tasas' && (
          <VistaTasas tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} setTasas={{ setTasaRacional, setTasaTenpo, setTasaBolsillo, setTasaBanco, setTasaMercadoPago }} />
        )}

        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>💰 Sistema automático • Actualización en tiempo real</p>
          <p className="mt-2">Chile 🇨🇱 • 2026-2032</p>
          <p className="mt-2 text-green-400">✅ Guardado automático</p>
        </div>
      </div>
    </div>
  );
};

export default TableroFinanciero;