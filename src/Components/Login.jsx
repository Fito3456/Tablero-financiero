import React, { useState, useEffect } from 'react';
import { DollarSign, User, LogIn } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recordar, setRecordar] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Seguir el mouse
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (usuario === 'renato' && password === 'Fito2026') {
      onLogin(usuario, recordar);
    } else {
      setError('❌ Usuario o contraseña incorrectos');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Calcular posición de las pupilas
  const calculatePupilPosition = () => {
    if (showPassword) return { x: 0, y: 0 };
    
    const monsterElement = document.querySelector('.monster-box');
    if (!monsterElement) return { x: 0, y: 0 };
    
    const rect = monsterElement.getBoundingClientRect();
    const monsterCenterX = rect.left + rect.width / 2;
    const monsterCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(mousePos.y - monsterCenterY, mousePos.x - monsterCenterX);
    const distance = Math.min(6, Math.hypot(mousePos.x - monsterCenterX, mousePos.y - monsterCenterY) / 40);
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  };

  const pupilPos = calculatePupilPosition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Formas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full">
        {/* Monstruo */}
        <div className="flex justify-center mb-8">
          <div className="monster-box relative w-36 h-36">
            {/* Cuerpo del monstruo */}
            <div 
              className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-full relative shadow-2xl"
              style={{
                borderRadius: '50% 50% 45% 45%',
                animation: 'bounce 2s infinite ease-in-out'
              }}
            >
              {/* Cuernos */}
              <div className="absolute -top-4 left-6 w-5 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-t-full transform -rotate-12"></div>
              <div className="absolute -top-4 right-6 w-5 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-t-full transform rotate-12"></div>
              
              {/* Brazos */}
              <div 
                className="absolute left-0 top-16 w-7 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full transform -translate-x-3 -rotate-30"
                style={{animation: 'wave-left 1.5s infinite ease-in-out'}}
              ></div>
              <div 
                className="absolute right-0 top-16 w-7 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full transform translate-x-3 rotate-30"
                style={{animation: 'wave-right 1.5s infinite ease-in-out'}}
              ></div>
              
              {/* Ojos - más amigables */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-7">
                {/* Ojo izquierdo */}
                <div className={`w-9 h-9 bg-white rounded-full relative shadow-inner transition-all duration-300 ${showPassword ? 'scale-y-50' : ''}`}>
                  {!showPassword && (
                    <div 
                      className="w-4 h-4 bg-gray-900 rounded-full absolute top-1/2 left-1/2 transition-transform duration-100"
                      style={{
                        transform: `translate(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px))`
                      }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1"></div>
                    </div>
                  )}
                  {showPassword && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-0.5 bg-emerald-800 rounded-full"></div>
                    </div>
                  )}
                </div>
                {/* Ojo derecho */}
                <div className={`w-9 h-9 bg-white rounded-full relative shadow-inner transition-all duration-300 ${showPassword ? 'scale-y-50' : ''}`}>
                  {!showPassword && (
                    <div 
                      className="w-4 h-4 bg-gray-900 rounded-full absolute top-1/2 left-1/2 transition-transform duration-100"
                      style={{
                        transform: `translate(calc(-50% + ${pupilPos.x}px), calc(-50% + ${pupilPos.y}px))`
                      }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1 left-1"></div>
                    </div>
                  )}
                  {showPassword && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-0.5 bg-emerald-800 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Boca */}
              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-14 h-7 border-3 border-emerald-800 border-t-0 rounded-b-full"></div>
            </div>
          </div>
        </div>

        {/* Título con signo de dólar */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              FinanzApp
            </h1>
          </div>
          <p className="text-gray-600 text-sm">Tablero Financiero Personal</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-xl p-3 text-red-700 text-sm text-center font-semibold animate-pulse">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              💤 Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              🔒 Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
              >
                {showPassword ? '👁️' : '👁️'}
              </button>
            </div>
          </div>

          {/* Toggle mejorado y limpio */}
          <div className="flex items-center justify-between bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border-2 border-emerald-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <span className="font-bold text-emerald-800">Recordar sesión</span>
            </div>
            <label className="relative inline-block w-14 h-8 cursor-pointer">
              <input
                type="checkbox"
                checked={recordar}
                onChange={(e) => setRecordar(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-green-600 transition-all duration-300 shadow-lg"></div>
              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${recordar ? 'translate-x-6' : ''}`}>
                {recordar && <span className="text-emerald-600 text-xs font-bold">✓</span>}
              </div>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Iniciar Sesión
          </button>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes wave-left {
            0%, 100% { transform: translateX(-12px) rotate(-30deg); }
            50% { transform: translateX(-12px) rotate(-40deg); }
          }
          @keyframes wave-right {
            0%, 100% { transform: translateX(12px) rotate(30deg); }
            50% { transform: translateX(12px) rotate(40deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;