import React, { useState, useEffect } from 'react';

const Header = () => {
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    return fechaHora.toLocaleString('es-CL', opciones);
  };

  return (
    <div className="mb-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 opacity-10 blur-3xl"></div>
        <h1 className="relative text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent" style={{
          fontFamily: "'Poppins', 'Inter', sans-serif",
          letterSpacing: '0.02em'
        }}>
          Tablero Financiero
        </h1>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <p className="text-xl font-bold bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 bg-clip-text text-transparent" style={{
            fontFamily: "'Poppins', sans-serif"
          }}>
            RENATO
          </p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        </div>
        <p className="text-emerald-200 text-sm tracking-wide">2026-2032 • Crecimiento Inteligente</p>
      </div>
      
      <div className="mt-4 bg-white/5 backdrop-blur-lg rounded-xl p-3 border border-emerald-500/20 inline-block">
        <p className="text-white text-sm font-semibold">🇨🇱 {formatearFechaHora()}</p>
      </div>
    </div>
  );
};

export default Header;