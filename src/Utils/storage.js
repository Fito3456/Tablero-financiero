// ============ SISTEMA DE ALMACENAMIENTO UNIVERSAL ============
export const storage = {
  async get(key, shared = false) {
    if (window.storage) {
      try {
        return await window.storage.get(key, shared);
      } catch (error) {
        console.log('No existe la clave:', key);
        return null;
      }
    } else {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    }
  },

  async set(key, value, shared = false) {
    if (window.storage) {
      try {
        return await window.storage.set(key, value, shared);
      } catch (error) {
        console.error('Error guardando en window.storage:', error);
        return null;
      }
    } else {
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
    if (window.storage) {
      try {
        return await window.storage.delete(key, shared);
      } catch (error) {
        console.error('Error eliminando en window.storage:', error);
        return null;
      }
    } else {
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

// Funciones auxiliares
export const formatCLP = (valor) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor);
};

export const calcularInteres = (capital, tasa, meses) => {
  return capital * Math.pow(1 + tasa / 12, meses);
};