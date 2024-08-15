import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Vendidos.css'; // Asegúrate de que la ruta sea correcta y el nombre del archivo sea exacto

export default function Vendidos() {
  const [propietarios, setPropietarios] = useState([]);
  const [propietariosMostrados, setPropietariosMostrados] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log('propietarios', response.data.propietarios);
        setPropietarios(response.data.propietarios);
        setPropietariosMostrados(response.data.propietarios); // Inicialmente mostrar todos los propietarios
      })
      .catch((error) => {
        console.error('Error al obtener los propietarios:', error);
        // Aquí podrías considerar mostrar un mensaje de error al usuario
      });
  }, []);

  const handleFechaFiltroChange = (event) => {
    const fecha = event.target.value;
    setFechaFiltro(fecha);

    // Filtrar propietarios por fecha
    const propietariosFiltrados = propietarios.filter(propietario => {
      return new Date(propietario.fecha_nacimiento).toLocaleDateString() === fecha;
    });

    setPropietariosMostrados(propietariosFiltrados);
  };

  const handleToggleInfo = (id) => {
    const propietariosActualizados = propietariosMostrados.map(propietario =>
      propietario.id === id ? { ...propietario, expanded: !propietario.expanded } : propietario
    );
    setPropietariosMostrados(propietariosActualizados);
  };

  return (
    <div className="propietarios">
      <h2>Clientes</h2>
      <div className="filtro-fecha">
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaFiltroChange}
        />
        <button onClick={() => setFechaFiltro("")}>Limpiar Filtro</button>
      </div>
      
      {/* Renderizar la información de los propietarios */}
      {propietariosMostrados.map((propietario) => (
        <div key={propietario.id} className="propietario">
          <p className="fecha">
            {new Date(propietario.fecha_nacimiento).toLocaleDateString()}
          </p>
          <button onClick={() => handleToggleInfo(propietario.id)}>
            {propietario.expanded ? "Ocultar Detalles" : "Mostrar Detalles"}
          </button>
          {propietario.expanded && (
            <div className="info-adicional">
              <p>
                <strong>Nombre:</strong> {propietario.nombre_propietario}
              </p>
              <p>
                <strong>Apellido:</strong> {propietario.apellido_propietario}
              </p>
              <p>
                <strong>Cédula:</strong> {propietario.cedula_propietario}
              </p>
              <p>
                <strong>Correo:</strong> {propietario.correo}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {new Date(propietario.fecha_nacimiento).toLocaleDateString()}
              </p>
              <p>
                <strong>Teléfono:</strong> {propietario.telefono}
              </p>
              <p>
                <strong>Ciudad:</strong> {propietario.ciudad}
              </p>
              <p>
                <strong>Estado:</strong> {propietario.estado}
              </p>
              <p>
                <strong>Municipio:</strong> {propietario.municipio}
              </p>
              <p>
                <strong>Dirección:</strong> {propietario.direccion}
              </p>
              {/* Mostrar imágenes */}
              {propietario.imagen_cedula && (
                <div>
                  <p>
                    <strong>Imagen Cédula:</strong>
                  </p>
                  <img
                    src={`data:image/png;base64,${propietario.imagen_cedula}`}
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
