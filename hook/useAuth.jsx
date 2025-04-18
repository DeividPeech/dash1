'use client';
import useSWR from 'swr';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

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

      await mutate(); 
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
