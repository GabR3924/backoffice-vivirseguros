import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import '../CSS/Vendidos.css';

// Asegúrate de definir los encabezados para el CSV
const headers = [
  { label: "ID Propietario", key: "id" },
  { label: "Cédula", key: "cedula_propietario" },
  { label: "Nombre", key: "nombre_propietario" },
  { label: "Apellido", key: "apellido_propietario" },
  { label: "Fecha de Nacimiento", key: "fecha_nacimiento" },
  { label: "Año Vehículo", key: "ano_vehiculo" },
  { label: "Marca Vehículo", key: "marca_vehiculo" },
  { label: "Modelo Vehículo", key: "modelo_vehiculo" },
  { label: "Placa Vehículo", key: "placa_vehiculo" },
  { label: "Serial Vehículo", key: "serial_vehiculo" },
  { label: "Referencia Pago", key: "paymentData_referencia" },
  { label: "Monto Pago", key: "paymentData_monto" },
  { label: "Banco Pago", key: "paymentData_banco" }
];

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
    return vehiculos.find(vehiculo => vehiculo.id_intermediario === id_propietario) || {};
  };

  const obtenerPagoPorPropietario = (id_propietario) => {
    return pagos.find(pago => pago.id_propietario === id_propietario) || {};
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

  // Crear una estructura adecuada para el CSV
  const dataForCSV = propietarios.map(propietario => {
    const vehiculo = obtenerVehiculoPorPropietario(propietario.id);
    const pago = obtenerPagoPorPropietario(propietario.id);

    return {
      id: propietario.id,
      cedula_propietario: propietario.cedula_propietario,
      nombre_propietario: propietario.nombre_propietario,
      apellido_propietario: propietario.apellido_propietario,
      fecha_nacimiento: new Date(propietario.fecha_nacimiento).toLocaleDateString(),
      ano_vehiculo: vehiculo.ano_vehiculo || 'No disponible',
      marca_vehiculo: vehiculo.marca_vehiculo || 'No disponible',
      modelo_vehiculo: vehiculo.modelo_vehiculo || 'No disponible',
      placa_vehiculo: vehiculo.placa_vehiculo || 'No disponible',
      serial_vehiculo: vehiculo.serial_vehiculo || 'No disponible',
      paymentData_referencia: pago.paymentData_referencia || 'No disponible',
      paymentData_monto: pago.paymentData_monto || 'No disponible',
      paymentData_banco: pago.paymentData_banco || 'No disponible',
    };
  });

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
            <p><strong>Cédula:</strong> {propietario.cedula_propietario}</p>
            <p><strong>Nombre:</strong> {propietario.nombre_propietario}</p>
            <p><strong>Apellido:</strong> {propietario.apellido_propietario}</p>

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
                <p><strong>Año:</strong> {vehiculos.ano_vehiculo || 'No disponible'}</p>
                <p><strong>Marca:</strong> {vehiculos.marca_vehiculo || 'No disponible'}</p>
                <p><strong>Modelo:</strong> {vehiculos.modelo_vehiculo || 'No disponible'}</p>
                <p><strong>Placa:</strong> {vehiculos.placa_vehiculo || 'No disponible'}</p>
                <p><strong>Serial:</strong> {vehiculos.serial_vehiculo || 'No disponible'}</p>
                {vehiculos.imagen && (
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
                <p><strong>Referencia:</strong> {pagos.paymentData_referencia || 'No disponible'}</p>
                <p><strong>Monto:</strong> {pagos.paymentData_monto || 'No disponible'}</p>
                <p><strong>Banco:</strong> {pagos.paymentData_banco || 'No disponible'}</p>
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

      {/* Añade el enlace de descarga CSV */}
      <CSVLink 
        data={dataForCSV} 
        headers={headers} 
        filename="datos_propietarios.csv"
        className="btn btn-primary"
      >
        Descargar CSV
      </CSVLink>
    </div>
  );
}
