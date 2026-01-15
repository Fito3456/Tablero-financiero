import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { storage, formatCLP } from './Utils/storage';

const PetShop = () => {
  const [cantidad, setCantidad] = useState(1);
  const [ventas, setVentas] = useState([]);
  const [ventasTotal, setVentasTotal] = useState(0);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const ventasData = await storage.get('ventas-petshop', true);
      if (ventasData) {
        const ventasArray = JSON.parse(ventasData.value);
        setVentas(ventasArray);
        const total = ventasArray.reduce((sum, v) => sum + v.total, 0);
        setVentasTotal(total);
      }
    } catch (error) {
      console.log('No hay ventas previas');
    }
  };

  const productos = [
    { nombre: 'Comedero', precio: 10000, icon: '🍽️', color: 'from-blue-500 to-blue-600' },
    { nombre: 'Ropa Pequeña', precio: 2000, icon: '👕', color: 'from-pink-500 to-pink-600' },
    { nombre: 'Ropa Grande', precio: 5000, icon: '👔', color: 'from-purple-500 to-purple-600' },
    { nombre: 'Cono', precio: 6000, icon: '🎯', color: 'from-orange-500 to-orange-600' }
  ];

  const realizarVenta = async (producto) => {
    const venta = {
      producto: producto.nombre,
      cantidad,
      precio: producto.precio,
      total: producto.precio * cantidad,
      fecha: new Date().toLocaleString('es-CL', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    const nuevasVentas = [...ventas, venta];
    setVentas(nuevasVentas);
    
    const nuevoTotal = ventasTotal + venta.total;
    setVentasTotal(nuevoTotal);
    
    try {
      // COMPARTIDO: true para sincronizar entre todos los usuarios
      await storage.set('ventas-petshop', JSON.stringify(nuevasVentas), true);
      await storage.set('ventas-total', nuevoTotal.toString(), true);
    } catch (error) {
      console.error('Error al guardar venta:', error);
    }
    
    alert(`✅ Venta registrada: ${cantidad}x ${producto.nombre} = ${formatCLP(venta.total)}`);
    setCantidad(1);
  };

  const limpiarVentas = async () => {
    if (!window.confirm('¿Seguro que deseas limpiar todas las ventas del día?')) return;
    
    setVentas([]);
    setVentasTotal(0);
    
    try {
      await storage.delete('ventas-petshop', true);
      await storage.delete('ventas-total', true);
      alert('✅ Ventas limpiadas');
    } catch (error) {
      console.error('Error al limpiar ventas:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Package className="w-8 h-8 text-pink-400" />
          PetShop Iquique 🐾
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-6 border border-pink-400/30">
            <p className="text-pink-200 text-sm mb-1">💰 Total Ventas del Día</p>
            <p className="text-white text-4xl font-bold">{formatCLP(ventasTotal)}</p>
            <p className="text-pink-200 text-xs mt-2">{ventas.length} ventas registradas</p>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
            <p className="text-green-200 text-sm mb-1">💎 Ganancia al Tablero</p>
            <p className="text-white text-4xl font-bold">{formatCLP(ventasTotal)}</p>
            <p className="text-green-200 text-xs mt-2">Se suma a Ganancia Neta</p>
          </div>
        </div>

        <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <label className="block text-emerald-200 text-sm font-semibold mb-2">
            📦 Cantidad a Vender
          </label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-2 border-emerald-400 focus:border-emerald-600 outline-none text-xl font-bold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {productos.map((producto, idx) => (
            <button
              key={idx}
              onClick={() => realizarVenta(producto)}
              className={`bg-gradient-to-br ${producto.color} rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all text-left`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{producto.icon}</span>
                <span className="text-white text-2xl font-bold">{formatCLP(producto.precio)}</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">{producto.nombre}</h3>
              <p className="text-white/80 text-sm">
                Vender {cantidad} × {formatCLP(producto.precio)} = {formatCLP(producto.precio * cantidad)}
              </p>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl p-4 border border-green-500/30">
            <p className="text-white text-sm">
              💡 Las ventas se suman automáticamente a tu Ganancia Neta en el Resumen
            </p>
          </div>
          
          {ventas.length > 0 && (
            <button
              onClick={limpiarVentas}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🗑️ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Historial de Ventas */}
      {ventas.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            📋 Historial de Ventas
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ventas.slice().reverse().map((venta, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold text-lg">{venta.cantidad}x {venta.producto}</p>
                    <p className="text-emerald-300 text-xs">{venta.fecha}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xl font-bold">{formatCLP(venta.total)}</p>
                    <p className="text-white/60 text-xs">{formatCLP(venta.precio)} c/u</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetShop;
