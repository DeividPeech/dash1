'use client';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Configurar axios con baseURL y headers
const api = axios.create({
  baseURL: 'http://192.168.0.195:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Asignar token desde localStorage si existe
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Usar axios configurado como fetcher para SWR
const fetcher = (url) => api.get(url).then(res => res.data);

const useAuth = () => {
  const router = useRouter();

  const { data: user, mutate, error } = useSWR('/user', fetcher);

  const login = async (credentials) => {
    try {
      const res = await api.post('/login', credentials);
      const token = res.data.token;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await mutate(); // Refresca el usuario
      router.push('/graficas');
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      await mutate(null);
      router.push('/');
    }
  };

  return {
    user,
    isLoading: !error && !user,
    isError: error,
    login,
    logout,
  };
};

export default useAuth;
