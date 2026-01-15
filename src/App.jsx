import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

// Importar componentes
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PetShop from './components/PetShop';
import VistaResumen from './components/VistaResumen';
import VistaActivos from './components/VistaActivos';
import VistaGastos from './components/VistaGastos';
import VistaProyeccion from './components/VistaProyeccion';
import VistaCronograma from './components/VistaCronograma';
import VistaTasas from './components/VistaTasas';

// Importar utilidades (SOLO UNA VEZ)
import { storage, calcularInteres } from './utils/storage';

function App() {
  // Estado de autenticación
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  
  // Estado de navegación
  const [vistaActual, setVistaActual] = useState(() => {
    // Cargar la vista guardada o usar 'resumen' por defecto
    return localStorage.getItem('vista-actual') || 'resumen';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Tasas de interés
  const [tasaRacional, setTasaRacional] = useState(0.09);
  const [tasaTenpo, setTasaTenpo] = useState(0.09);
  const [tasaBolsillo, setTasaBolsillo] = useState(0.06);
  const [tasaBanco, setTasaBanco] = useState(0.06);
  const [tasaMercadoPago, setTasaMercadoPago] = useState(0.06);

  // Datos financieros
  const [gastosUniversidad, setGastosUniversidad] = useState({});
  const [aportes, setAportes] = useState([]);
  const [mesesCompletados, setMesesCompletados] = useState(new Set());
  const [dolarReal, setDolarReal] = useState(883);
  const [ventasPetShop, setVentasPetShop] = useState(0);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Cargar ventas del PetShop
  useEffect(() => {
    cargarVentasPetShop();
  }, []);

  // Actualizar dólar automáticamente
  useEffect(() => {
    obtenerDolarReal();
    const interval = setInterval(obtenerDolarReal, 300000); // Cada 5 minutos
    return () => clearInterval(interval);
  }, []);

  const cargarDatosIniciales = async () => {
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

  const cargarVentasPetShop = async () => {
    try {
      const ventasTotal = await storage.get('ventas-total', true);
      if (ventasTotal) {
        setVentasPetShop(parseFloat(ventasTotal.value) || 0);
      }
    } catch (error) {
      console.log('No hay ventas previas');
    }
  };

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

  const obtenerDolarReal = async () => {
    try {
      const response = await fetch('https://mindicador.cl/api/dolar');
      const data = await response.json();
      if (data.serie?.[0]?.valor) {
        setDolarReal(data.serie[0].valor);
      }
    } catch (error) {
      console.log('Error obteniendo dólar real, usando valor por defecto');
    }
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
      mesesContados
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

  const handleLogin = (user) => {
    setUsuario(user);
    setAutenticado(true);
  };

  if (cargandoDatos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950 flex">
      {/* Sidebar */}
      <Sidebar 
        vistaActual={vistaActual} 
        onCambiarVista={setVistaActual}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {/* Botón menú mobile */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-all"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-7xl mx-auto lg:ml-0">
            <Header />
            
            {vistaActual === 'resumen' && (
              <VistaResumen
                totales={totales}
                ganancia={ganancia}
                rentabilidad={rentabilidad}
                gastosAnuales={gastosAnuales}
                dolarReal={dolarReal}
                actualizarDolar={obtenerDolarReal}
                ventasPetShop={ventasPetShop}
              />
            )}

            {vistaActual === 'petshop' && <PetShop />}

            {vistaActual === 'activos' && (
              <VistaActivos 
                totales={totales} 
                tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} 
                onEditarTasas={() => setVistaActual('tasas')} 
              />
            )}

            {vistaActual === 'gastos' && (
              <VistaGastos 
                gastosUniversidad={gastosUniversidad} 
                setGastosUniversidad={setGastosUniversidad} 
              />
            )}

            {vistaActual === 'proyeccion' && (
              <VistaProyeccion 
                aportes={aportes} 
                tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} 
                gastosUniversidad={gastosUniversidad} 
              />
            )}

            {vistaActual === 'aportes' && (
              <VistaCronograma 
                aportes={aportes} 
                setAportes={setAportes} 
                mesesCompletados={mesesCompletados} 
                setMesesCompletados={setMesesCompletados} 
              />
            )}

            {vistaActual === 'tasas' && (
              <VistaTasas 
                tasas={{ tasaRacional, tasaTenpo, tasaBolsillo, tasaBanco, tasaMercadoPago }} 
                setTasas={{ setTasaRacional, setTasaTenpo, setTasaBolsillo, setTasaBanco, setTasaMercadoPago }} 
              />
            )}

            <div className="mt-8 text-center text-emerald-300 text-sm">
              <p>💰 Sistema automático • Actualización en tiempo real</p>
              <p className="mt-2">Chile 🇨🇱 • 2026-2032</p>
              <p className="mt-2 text-emerald-400">✅ Guardado automático • Usuario: {usuario}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
