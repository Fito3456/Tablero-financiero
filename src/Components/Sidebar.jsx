import React from 'react';
import { DollarSign, X, BarChart3, Package, Wallet, ShoppingCart, Target, Calendar, Edit2 } from 'lucide-react';

const Sidebar = ({ vistaActual, onCambiarVista, isMobileOpen, setIsMobileOpen, usuario, onCerrarSesion }) => {
  const vistas = [
    { id: 'resumen', icon: BarChart3, label: 'Resumen', color: 'from-emerald-500 to-green-500' },
    { id: 'petshop', icon: Package, label: 'PetShop', color: 'from-pink-500 to-rose-500' },
    { id: 'activos', icon: Wallet, label: 'Activos', color: 'from-teal-500 to-cyan-500' },
    { id: 'gastos', icon: ShoppingCart, label: 'Gastos Universidad', color: 'from-amber-500 to-orange-500' },
    { id: 'proyeccion', icon: Target, label: 'Proyección 2032', color: 'from-green-500 to-emerald-500' },
    { id: 'aportes', icon: Calendar, label: 'Cronograma', color: 'from-lime-500 to-green-500' },
    { id: 'tasas', icon: Edit2, label: 'Editar Tasas', color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <>
      {/* Botón hamburguesa - visible en todas las pantallas cuando sidebar está cerrado */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-30 bg-gradient-to-br from-emerald-600 to-green-700 text-white p-3 rounded-xl shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Overlay - visible cuando está abierto */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-72 
        bg-gradient-to-b from-slate-900/95 via-emerald-950/95 to-slate-900/95 
        backdrop-blur-xl border-r border-emerald-500/20
        z-50 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Header del Sidebar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">FinanzApp</h2>
                  <p className="text-emerald-300 text-xs">v2.0</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-2">
            {vistas.map(vista => {
              const Icon = vista.icon;
              const isActive = vistaActual === vista.id;
              return (
                <button
                  key={vista.id}
                  onClick={() => {
                    onCambiarVista(vista.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                    transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r ' + vista.color + ' text-white shadow-lg scale-105' 
                      : 'text-emerald-200 hover:bg-emerald-500/10 hover:text-white'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'}`} />
                  <span className="relative z-10 font-semibold text-sm">{vista.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer del Sidebar */}
{/* Footer del Sidebar */}
          <div className="mt-auto pt-6 border-t border-emerald-500/20 space-y-3">
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl p-4 border border-emerald-500/30">
              <p className="text-emerald-300 text-xs font-semibold mb-1">✅ Sistema Activo</p>
              <p className="text-white/70 text-xs">Sincronización en tiempo real</p>
              <p className="text-emerald-400 text-xs mt-1">Usuario: {usuario}</p>
            </div>
            
            <button
              onClick={onCerrarSesion}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;