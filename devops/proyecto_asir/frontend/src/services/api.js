/**
 * API Service - Configuración centralizada para comunicación con microservicios.
 * 
 * Usando llamadas reales a los microservicios en Python.
 */

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/auth';
const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:4000/api/products';

export const authService = {

  register: async ({ nombre, apellido, email, telefono, password }) => {
    try {
      const res = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, telefono, password })
      });
      return await res.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error de conexión con el servidor de autenticación.' };
    }
  },

  login: async ({ email, password }) => {
    try {
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('petstore_token', data.token);
        localStorage.setItem('petstore_currentUser', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error de conexión con el servidor de autenticación.' };
    }
  },

  logout: () => {
    localStorage.removeItem('petstore_currentUser');
    localStorage.removeItem('petstore_token');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('petstore_currentUser'));
  }
};

export const adminService = {

  login: async (username, password) => {
    try {
      const res = await fetch(`${AUTH_API_URL}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem('admin_token', data.token)
      }
      return data
    } catch {
      return { success: false, message: 'Error de conexión con el servidor.' }
    }
  },

  verify: async () => {
    const token = sessionStorage.getItem('admin_token')
    if (!token) return false
    try {
      const res = await fetch(`${AUTH_API_URL}/admin-verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!data.valid) sessionStorage.removeItem('admin_token')
      return data.valid === true
    } catch {
      return false
    }
  },

  logout: () => {
    sessionStorage.removeItem('admin_token')
  },
}

export const logsService = {

  getStats: async (service = 'full', type = null) => {
    const base = service === 'lista' ? '/api/auth-lista-cerrada' : '/api/auth'
    const qs = type ? `?type=${type}` : ''
    try {
      const res = await fetch(`${base}/stats${qs}`)
      return await res.json()
    } catch {
      return { total: 0, success: 0, blocked: 0, duplicates: 0, success_rate: 0, by_result: {} }
    }
  },

  getLogs: async (service = 'full', limit = 200, type = null) => {
    const base = service === 'lista' ? '/api/auth-lista-cerrada' : '/api/auth'
    const qs = type ? `?limit=${limit}&type=${type}` : `?limit=${limit}`
    try {
      const res = await fetch(`${base}/logs${qs}`)
      return await res.json()
    } catch {
      return []
    }
  },
}

export const blocklistService = {

  list: async () => {
    const token = sessionStorage.getItem('admin_token')
    try {
      const res = await fetch(`${AUTH_API_URL}/blocklist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) return []
      return await res.json()
    } catch {
      return []
    }
  },

  add: async (domain) => {
    const token = sessionStorage.getItem('admin_token')
    try {
      const res = await fetch(`${AUTH_API_URL}/blocklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ domain })
      })
      return await res.json()
    } catch {
      return { success: false, message: 'Error de conexión.' }
    }
  },

  remove: async (domain) => {
    const token = sessionStorage.getItem('admin_token')
    try {
      const res = await fetch(`${AUTH_API_URL}/blocklist/${encodeURIComponent(domain)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return await res.json()
    } catch {
      return { success: false, message: 'Error de conexión.' }
    }
  },
}

export const productsService = {

  getAll: async () => {
    try {
      const res = await fetch(PRODUCTS_API_URL);
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getByCategory: async (category) => {
    try {
      const res = await fetch(`${PRODUCTS_API_URL}/${category}`);
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};
