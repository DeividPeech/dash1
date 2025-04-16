'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GraficasPage = () => {
  const [porDepartamento, setPorDepartamento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Ensure we are in the client environment before using localStorage
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

  if (loading) return <p className="text-center p-4">Cargando gráfica...</p>;

  return (
    <div className="p-6 space-y-10">
      <div className="flex justify-center mb-6">
        <img
          src="https://satq.qroo.gob.mx/logos/LOGO-CONJUNTO-COMPACTO.png" // Reemplaza con la ruta de tu logotipo
          alt="Logotipo"
          className="h-16 w-auto"
        />
      </div>
      <h2 className="text-2xl font-bold">Gráficas de Solicitudes</h2>

      {/* Gráfica de solicitudes por departamento */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Solicitudes por Departamento</h3>
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
      </div>
    </div>
  );
};

export default GraficasPage;