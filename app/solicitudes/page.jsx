'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hook/useAuth';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, Menu, MenuItem, IconButton, Pagination,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const departamentos = [
  { id: 1, nombre: 'Recursos Humanos' },
  { id: 2, nombre: 'Soporte Técnico' },
  { id: 3, nombre: 'Finanzas' },
];

const estados = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'resuelto', label: 'Resuelto' },
  { value: 'rechazado', label: 'Rechazado' },
];

const SolicitudesPage = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolio, setSelectedFolio] = useState(null);
  const [openReasignar, setOpenReasignar] = useState(false);
  const [openEstado, setOpenEstado] = useState(false);
  const [openHistorial, setOpenHistorial] = useState(false);
  const [nuevoDepartamento, setNuevoDepartamento] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [historialSeleccionado, setHistorialSeleccionado] = useState([]);

  const rowsPerPage = 5;

  const fetchSolicitudes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes`, {
        
        params: {
          page,
          per_page: rowsPerPage,
          departamento_id: user.departamento_id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSolicitudes(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [page, user]);

  const handleMenuClick = (event, folio) => {
    setAnchorEl(event.currentTarget);
    setSelectedFolio(folio);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const abrirModalReasignar = () => {
    setNuevoDepartamento('');
    setOpenReasignar(true);
    handleMenuClose();
  };

  const abrirModalEstado = () => {
    setNuevoEstado('');
    setOpenEstado(true);
    handleMenuClose();
  };

  const abrirModalHistorial = () => {
    const solicitud = solicitudes.find((s) => s.folio === selectedFolio);
    if (solicitud && solicitud.historial) {
      setHistorialSeleccionado(solicitud.historial);
    } else {
      setHistorialSeleccionado([]);
    }
    setOpenHistorial(true);
    handleMenuClose();
  };

  const cerrarModalReasignar = () => {
    setOpenReasignar(false);
    setNuevoDepartamento('');
    setSelectedFolio(null);
  };

  const cerrarModalEstado = () => {
    setOpenEstado(false);
    setNuevoEstado('');
    setSelectedFolio(null);
  };

  const cerrarModalHistorial = () => {
    setOpenHistorial(false);
    setHistorialSeleccionado([]);
    setSelectedFolio(null);
  };

  const reasignarDepartamento = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${selectedFolio}/reasignar`, {
        departamento_id: nuevoDepartamento,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Departamento reasignado correctamente');
      cerrarModalReasignar();
      fetchSolicitudes();
    } catch (err) {
      console.error('Error al reasignar:', err);
      alert('Error al reasignar departamento');
    }
  };

  const cambiarEstado = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${selectedFolio}/estado`, {
        estado: nuevoEstado,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Estado actualizado correctamente');
      cerrarModalEstado();
      fetchSolicitudes();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Solicitudes</h1>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Folio</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {solicitudes.map((s) => (
                  <TableRow key={s.folio}>
                    <TableCell>{s.folio}</TableCell>
                    <TableCell>{s.tipo}</TableCell>
                    <TableCell>{s.departamento?.nombre || '—'}</TableCell>
                    <TableCell>{estados.find(e => e.value === s.estado)?.label || 'Pendiente'}</TableCell>
                    <TableCell>{new Date(s.fecha_creacion).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuClick(e, s.folio)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </div>
        </>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={abrirModalReasignar}>Reasignar</MenuItem>
        <MenuItem onClick={abrirModalEstado}>Cambiar estatus</MenuItem>
        <MenuItem onClick={abrirModalHistorial}>Ver historial</MenuItem>
      </Menu>

      {/* Modal Reasignar */}
      <Dialog open={openReasignar} onClose={cerrarModalReasignar}>
        <DialogTitle>Reasignar Departamento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Departamento</InputLabel>
            <Select
              value={nuevoDepartamento}
              onChange={(e) => setNuevoDepartamento(e.target.value)}
              native
            >
              <option value="">Seleccionar...</option>
              {departamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalReasignar}>Cancelar</Button>
          <Button variant="contained" onClick={reasignarDepartamento} disabled={!nuevoDepartamento}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Estado */}
      <Dialog open={openEstado} onClose={cerrarModalEstado}>
        <DialogTitle>Cambiar Estado</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              native
            >
              <option value="">Seleccionar...</option>
              {estados.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalEstado}>Cancelar</Button>
          <Button variant="contained" onClick={cambiarEstado} disabled={!nuevoEstado}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Historial */}
      <Dialog open={openHistorial} onClose={cerrarModalHistorial} fullWidth maxWidth="md">
        <DialogTitle>Historial de la Solicitud</DialogTitle>
        <DialogContent>
          {historialSeleccionado.length === 0 ? (
            <p>No hay historial disponible.</p>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acción</TableCell>
                    <TableCell>Usuario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historialSeleccionado.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.fecha).toLocaleString()}</TableCell>
                      <TableCell>{item.accion}</TableCell>
                      <TableCell>{item.usuario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModalHistorial}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SolicitudesPage;
