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
