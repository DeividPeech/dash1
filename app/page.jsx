'use client';
import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Typography } from '@mui/material';
import useAuth from '@/hook/useAuth';
import Logo from '@/components/Logo';

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

    if (!form.email || !form.password) {
      setError('El correo electrónico y la contraseña son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await login(form);
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
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-8"
      >
        <div className="flex justify-center mb-8">
          <Logo /> 
        </div>
        
        <Typography variant="h5" component="h2" align="center" color="textPrimary" className="font-bold mb-6">
          Iniciar Sesión
        </Typography>

        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          name="email"
          value={form.email}
          onChange={handleChange}
          error={!!error} 
          helperText={error && !form.email ? 'El correo electrónico es obligatorio' : ''}
          className="mb-6" 
        />
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={!!error} 
          helperText={error && !form.password ? 'La contraseña es obligatoria' : ''}
          className="mb-6" 
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-6">{error}</p>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          className="py-2"
        >
          {loading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
