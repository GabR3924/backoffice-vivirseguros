import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Vendidos.css';

export default function Vendidos() {
  const [propietarios, setPropietarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [propietariosMostrados, setPropietariosMostrados] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [selectedPropietario, setSelectedPropietario] = useState(null); // Estado para el modal

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log('Datos recibidos:', response.data);
        setPropietarios(response.data.propietarios);
        setVehiculos(response.data.vehiculos);
        setPagos(response.data.pagos);
        setPropietariosMostrados(response.data.propietarios);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleFechaFiltroChange = (event) => {
    const fecha = event.target.value;
    setFechaFiltro(fecha);

    const propietariosFiltrados = propietarios.filter(propietario => {
      return new Date(propietario.fecha_nacimiento).toLocaleDateString() === fecha;
    });

    setPropietariosMostrados(propietariosFiltrados);
  };

  const obtenerVehiculoPorPropietario = (id_propietario) => {
    return vehiculos.find(vehiculo => vehiculo.id_intermediario === id_propietario);
  };

  const obtenerPagoPorPropietario = (id_propietario) => {
    return pagos.find(pago => pago.id_propietario === id_propietario);
  };

  const convertBufferToBase64 = (buffer) => {
    if (buffer && buffer.data) {
      const bytes = new Uint8Array(buffer.data);
      return btoa(String.fromCharCode.apply(null, bytes));
    }
    return '';
  };

  const handleModalClose = () => {
    setSelectedPropietario(null);
  };

  return (
    <div className="propietarios">
      <h2>Clientes</h2>
      <input
        type="date"
        value={fechaFiltro}
        onChange={handleFechaFiltroChange}
        placeholder="Filtrar por fecha"
      />

      {propietariosMostrados.map((propietario) => {
        const vehiculo = obtenerVehiculoPorPropietario(propietario.id);
        const pago = obtenerPagoPorPropietario(propietario.id);

        return (
          <div key={propietario.id} className="propietario">
            <p className="fecha">
              {new Date(propietario.fecha_nacimiento).toLocaleDateString()}
            </p>
            <button onClick={() => setSelectedPropietario(propietario)}>
              Mostrar Detalles
            </button>
          </div>
        );
      })}

      {selectedPropietario && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Detalles del Cliente</h2>
            <p><strong>Cédula:</strong> {selectedPropietario.cedula_propietario}</p>
            <p><strong>Nombre:</strong> {selectedPropietario.nombre_propietario}</p>
            <p><strong>Apellido:</strong> {selectedPropietario.apellido_propietario}</p>
            <p><strong>Fecha de nacimiento:</strong> {new Date(selectedPropietario.fecha_nacimiento).toLocaleDateString()}</p>

            <h3>Información del Vehículo</h3>
            {obtenerVehiculoPorPropietario(selectedPropietario.id) ? (
              <>
                <p><strong>Año:</strong> {vehiculo.ano_vehiculo || 'No disponible'}</p>
                <p><strong>Marca:</strong> {vehiculo.marca_vehiculo}</p>
                <p><strong>Modelo:</strong> {vehiculo.modelo_vehiculo || 'No disponible'}</p>
                <p><strong>Placa:</strong> {vehiculo.placa_vehiculo}</p>
                <p><strong>Serial:</strong> {vehiculo.serial_vehiculo}</p>
                {vehiculo.imagen_vehiculo && (
                  <img
                    src={`data:image/jpeg;base64,${convertBufferToBase64(vehiculo.imagen_vehiculo)}`}
                    alt="Imagen del vehículo"
                    style={{ width: '200px', height: 'auto' }}
                  />
                )}
              </>
            ) : <p>No hay información de vehículo</p>}

            <h3>Información de Pago</h3>
            {obtenerPagoPorPropietario(selectedPropietario.id) ? (
              <>
                <p><strong>Referencia:</strong> {pago.paymentData_referencia}</p>
                <p><strong>Monto:</strong> {pago.paymentData_monto}</p>
                <p><strong>Banco:</strong> {pago.paymentData_banco}</p>
              </>
            ) : <p>No hay información de pago</p>}

            {selectedPropietario.imagen_cedula && (
              <div>
                <h3>Imagen Cédula</h3>
                <img
                  src={`data:image/png;base64,${convertBufferToBase64(selectedPropietario.imagen_cedula)}`}
                  alt="Imagen Cédula"
                  style={{ width: '200px', height: 'auto' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
