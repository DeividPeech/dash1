'use client';
import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import useAuth from '../hook/useAuth'; // Asegúrate que esta ruta sea correcta

const LoginForm = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form); // Llama al hook directamente
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h2>

        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
