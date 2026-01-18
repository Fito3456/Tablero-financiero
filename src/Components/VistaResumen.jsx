import React, { useState, useEffect } from 'react';
import { DollarSign, Wallet, TrendingUp, PiggyBank, Calendar, ShoppingCart, Package } from 'lucide-react';
import StatCard from './StatCard';
import { formatCLP } from '../utils/storage';

const VistaResumen = ({ 
  totales, 
  ganancia, 
  rentabilidad, 
  gastosAnuales, 
  dolarReal, 
  actualizarDolar,
  ventasPetShop,
  onActualizarDatos
}) => {
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  // Sincronizar datos cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      onActualizarDatos();
      setUltimaActualizacion(new Date());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [onActualizarDatos]);

  const gananciaTotalConVentas = ganancia + ventasPetShop;

  return (
    <>
      {/* Banner de Sincronización */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl p-4 border border-emerald-400/30 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-bold">🔄 Sincronización Activa</p>
              <p className="text-emerald-200 text-xs">
                Última actualización: {ultimaActualizacion.toLocaleTimeString('es-CL')}
              </p>
            </div>
          </div>
          <button
            onClick={onActualizarDatos}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Indicadores Dólar y PetShop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard
          titulo="💹 Dólar Real USD/CLP"
          valor={formatCLP(dolarReal)}
          subtitulo="Actualizado cada 5 min"
          icon={DollarSign}
          gradient="from-emerald-500 via-emerald-600 to-green-600"
        >
          <button
            onClick={actualizarDolar}
            className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-all shadow-lg"
          >
            🔄 Actualizar ahora
          </button>
        </StatCard>

        <StatCard
          titulo="🐾 Ventas PetShop"
          valor={formatCLP(ventasPetShop)}
          subtitulo="Contribución adicional"
          icon={Package}
          gradient="from-pink-500 via-pink-600 to-rose-600"
        />
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          titulo="Total Invertido"
          valor={formatCLP(totales.invertido)}
          icon={Wallet}
          gradient="from-cyan-500 to-blue-600"
        />

        <StatCard
          titulo="Valor Actual"
          valor={formatCLP(totales.valorActual)}
          icon={TrendingUp}
          gradient="from-emerald-500 to-green-600"
        />

        <StatCard
          titulo="Ganancia Neta + Ventas"
          valor={formatCLP(gananciaTotalConVentas)}
          subtitulo={`+${rentabilidad}% inversiones + ventas`}
          icon={PiggyBank}
          gradient="from-lime-500 to-green-600"
        />

        <StatCard
          titulo="Meses Completados"
          valor={`${totales.mesesContados}`}
          subtitulo="de 72 meses"
          icon={Calendar}
          gradient="from-teal-500 to-cyan-600"
        />

        <div className="lg:col-span-2">
          <StatCard
            titulo="Gastos Universidad"
            valor={formatCLP(gastosAnuales.total)}
            subtitulo={`${gastosAnuales.mesesGastados} meses`}
            icon={ShoppingCart}
            gradient="from-orange-500 to-red-600"
          />
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-xl p-4 border border-cyan-500/30">
        <p className="text-white text-sm text-center">
          💡 Los datos se sincronizan automáticamente entre todos los dispositivos cada 3 segundos
        </p>
      </div>
    </>
  );
};

export default VistaResumen;