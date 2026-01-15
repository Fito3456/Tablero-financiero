import React, { useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { storage, formatCLP } from '../utils/storage';

const VistaCronograma = ({ aportes, setAportes, mesesCompletados, setMesesCompletados }) => {
  const [modoEdicion, setModoEdicion] = useState(false);

  const toggleCompletado = async (index) => {
    const nuevosCompletados = new Set(mesesCompletados);
    if (nuevosCompletados.has(index)) {
      nuevosCompletados.delete(index);
    } else {
      nuevosCompletados.add(index);
    }
    setMesesCompletados(nuevosCompletados);
    
    try {
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
      await storage.set('aportes-cronograma', JSON.stringify(nuevosAportes), true);
    } catch (error) {
      console.error('Error al guardar aportes:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto" style={{fontFamily: 'Courier New, monospace'}}>
      <div className="text-center border-b-2 border-dashed border-gray-400 pb-6 mb-6">
        <div className="text-3xl font-bold text-gray-800 mb-2">═══════════════════════════</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">PLAN DE AHORRO E INVERSIÓN</h2>
        <p className="text-sm text-gray-600">RENATO - CHILE 🇨🇱</p>
        <p className="text-xs text-gray-500 mt-2">Inicio: 25 de Enero 2026 - Fin: Diciembre 2031</p>
        <div className="text-3xl font-bold text-gray-800 mt-2">═══════════════════════════</div>
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
        <div className="text-3xl font-bold text-gray-800 mb-2">═══════════════════════════</div>
        <p className="text-xs text-gray-500">🎯 Disciplina financiera</p>
        <div className="text-3xl font-bold text-gray-800 mt-2">═══════════════════════════</div>
      </div>
    </div>
  );
};

export default VistaCronograma;