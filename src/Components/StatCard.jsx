import React from 'react';

const StatCard = ({ titulo, valor, subtitulo, icon: Icon, gradient, children }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/90 text-sm mb-1">{titulo}</p>
          <p className="text-white text-3xl md:text-4xl font-bold">{valor}</p>
          {subtitulo && (
            <p className="text-white/80 text-xs mt-2">{subtitulo}</p>
          )}
          {children}
        </div>
        {Icon && <Icon className="w-12 h-12 md:w-16 md:h-16 text-white opacity-50 ml-4" />}
      </div>
    </div>
  );
};

export default StatCard;