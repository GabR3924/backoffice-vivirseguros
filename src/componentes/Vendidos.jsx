import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Vendidos.css'; // Asegúrate de que la ruta sea correcta y el nombre del archivo sea exacto
import urls from '../routes';

export default function Vendidos() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosMostrados, setUsuariosMostrados] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:3000/obtenerDatos")
      .then((response) => {
        console.log('usuarios', response.data);
        setUsuarios(response.data);
        setUsuariosMostrados(response.data); // Inicialmente mostrar todos los usuarios
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  const handleFechaFiltroChange = (event) => {
    const fecha = event.target.value;
    setFechaFiltro(fecha);

    // Filtrar usuarios por fecha
    const usuariosFiltrados = usuarios.filter(usuario => {
      return new Date(usuario.datos_fnacimiento).toLocaleDateString() === fecha;
    });

    setUsuariosMostrados(usuariosFiltrados);
  };

  const handleToggleInfo = (id) => {
    const usuariosActualizados = usuariosMostrados.map(usuario =>
      usuario.id === id ? { ...usuario, expanded: !usuario.expanded } : usuario
    );
    setUsuariosMostrados(usuariosActualizados);
  };

  return (
    <div className="usuarios">
      <h2>Clientes</h2>
      <div className="filtro-fecha">
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaFiltroChange}
        />
        <button onClick={() => setFechaFiltro("")}>Limpiar Filtro</button>
      </div>
      
      {/* Renderizar la información de los usuarios */}
      {usuariosMostrados.map((usuario) => (
        <div key={usuario.id} className="usuario">
          <p className="fecha">
            {new Date(usuario.datos_fnacimiento).toLocaleDateString()}
          </p>
          <button onClick={() => handleToggleInfo(usuario.id)}>
            {usuario.expanded ? "Ocultar Detalles" : "Mostrar Detalles"}
          </button>
          {usuario.expanded && (
            <div className="info-adicional">
              <p>
                <strong>Nombre:</strong> {usuario.datos_nombre}
              </p>
              <p>
                <strong>Apellido:</strong> {usuario.datos_apellido}
              </p>
              <p>
                <strong>Cédula:</strong> {usuario.datos_cedula}
              </p>
              <p>
                <strong>Correo:</strong> {usuario.datos_correo}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {new Date(usuario.datos_fnacimiento).toLocaleDateString()}
              </p>
              <p>
                <strong>Teléfono:</strong> {usuario.datos_telefono}
              </p>
              <p>
                <strong>Marca:</strong> {usuario.marca}
              </p>
              <p>
                <strong>Modelo:</strong> {usuario.modelo}
              </p>
              <p>
                <strong>Placa:</strong> {usuario.placa}
              </p>
              <p>
                <strong>Tipo de vehículo:</strong> {usuario.tipo}
              </p>
              <p>
                <strong>Establecimiento:</strong>{" "}
                {usuario.establishment_nombre}
              </p>
              <p>
                <strong>Año:</strong> {usuario.ano}
              </p>
              <p>
                <strong>Estilo:</strong> {usuario.estilo}
              </p>
              <p>
                <strong>Serial:</strong> {usuario.serial}
              </p>
              <p>
                <strong>Payment Data:</strong>
              </p>
              <ul>
                <li>
                  <strong>Banco:</strong> {usuario.paymentData_banco}
                </li>
                <li>
                  <strong>Monto:</strong> {usuario.paymentData_monto}
                </li>
                <li>
                  <strong>Referencia:</strong>{" "}
                  {usuario.paymentData_referencia}
                </li>
              </ul>
              {/* Mostrar imágenes */}
              {usuario.imagen_carnet && (
                <div>
                  <p>
                    <strong>Imagen Carnet:</strong>
                  </p>
                  <img
                    src={`data:image/png;base64,${usuario.imagen_carnet}`}
                    alt="Imagen Carnet"
                    style={{ width: '200px', height: 'auto' }} 
                  />
                </div>
              )}

              {usuario.imagen_cedula && (
                <div>
                  <p>
                    <strong>Imagen Cédula:</strong>
                  </p>
                  <img
                    src={`data:image/png;base64,${usuario.imagen_cedula}`}
                    alt="Imagen Cédula"
                    style={{ width: '200px', height: 'auto' }} 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
