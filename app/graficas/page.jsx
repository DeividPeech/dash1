'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GraficasPage = () => {
  const [datos, setDatos] = useState([]);
  const [concluidas, setConcluidas] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = 'TU_TOKEN_AQUI'; // reemplaza por tu lógica de auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/graficas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;
        setDatos(data.estadisticas);
        setConcluidas(data.concluidas);
      } catch (error) {
        console.error('Error al cargar datos de gráficas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center p-4">Cargando gráficas...</p>;

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold">Gráficas de Solicitudes</h2>

      {/* Gráfica de todas las solicitudes por estado */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Solicitudes por Estado</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="estado" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de solicitudes concluidas */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Solicitudes Concluidas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={concluidas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="estado" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficasPage;
