'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';
import Nav from '@/components/Nav';

const GraficasPage = () => {
  const [porDepartamento, setPorDepartamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/estadisticas/departamentos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPorDepartamento(res.data);
      } catch (err) {
        console.error('Error al cargar datos de gráficas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Box className="flex justify-center p-4">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <Nav />

      <Typography variant="h4" className="font-bold text-center">
        Gráficas de Solicitudes
      </Typography>

      <Box className="bg-white p-6 rounded-2xl shadow-md mt-6">
        <Typography variant="h6" className="font-semibold mb-4">
          Solicitudes por Departamento
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porDepartamento}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="departamento" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default GraficasPage;
