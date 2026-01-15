import React from 'react';
import { DollarSign, Wallet, TrendingUp, PiggyBank, Calendar, ShoppingCart, Package } from 'lucide-react';
import StatCard from './StatCard';
import { formatCLP } from './Utils/storage';

const VistaResumen = ({ 
  totales, 
  ganancia, 
  rentabilidad, 
  gastosAnuales, 
  dolarReal, 
  actualizarDolar,
  ventasPetShop 
}) => {
  const gananciaTotalConVentas = ganancia + ventasPetShop;

  return (
    <>
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
    </>
  );
};

export default VistaResumen;
