import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Asegurados.css";

export default function Asegurados() {
  const [asegurados, setAsegurados] = useState([]);
  const [aseguradosMostrados, setAseguradosMostrados] = useState([]);
  const [pagosMostrados, setPagosMostrados] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [vehiculos, setVehiculos] = useState([]); // Estado para los datos de vehículos

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log("asegurados", response.data);
        setAsegurados(response.data.asegurados);
        setAseguradosMostrados(response.data.asegurados);
        setPagosMostrados(response.data.pagos);
        setVehiculos(response.data.vehiculos); // Guardar los datos de vehículos
      })
      .catch((error) => {
        console.error("Error al obtener los asegurados:", error);
      });
  }, []);

  const handleFechaFiltroChange = (event) => {
    const fecha = event.target.value;
    setFechaFiltro(fecha);

    const aseguradosFiltrados = asegurados.filter((asegurado) => {
      return (
        new Date(asegurado.fecha_nacimiento).toLocaleDateString() === fecha
      );
    });

    setAseguradosMostrados(aseguradosFiltrados);
  };

  const handleToggleInfo = (id) => {
    const aseguradosActualizados = aseguradosMostrados.map((asegurado) =>
      asegurado.id === id
        ? { ...asegurado, expanded: !asegurado.expanded }
        : asegurado
    );
    setAseguradosMostrados(aseguradosActualizados);
  };

  const handleImageDownload = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="asegurados">
      <h2>Asegurados</h2>
      <div className="filtro-fecha">
        <input type="date" value={fechaFiltro} onChange={handleFechaFiltroChange} />
        <button onClick={() => setFechaFiltro("")}>Limpiar Filtro</button>
      </div>
  
      {aseguradosMostrados.map((asegurado) => (
        <div key={asegurado.id} className="asegurado">
          <p className="fecha">
            {new Date(asegurado.fecha_nacimiento).toLocaleDateString()}
          </p>
          <button onClick={() => handleToggleInfo(asegurado.id)}>
            {asegurado.expanded ? "Ocultar Detalles" : "Mostrar Detalles"}
          </button>
  
          {asegurado.expanded && (
            <div className="info-adicional">
              <table>
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Información</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Nombre</td>
                    <td>{asegurado.nombre_propietario}</td>
                  </tr>
                  <tr>
                    <td>Apellido</td>
                    <td>{asegurado.apellido_propietario}</td>
                  </tr>
                  <tr>
                    <td>Cédula</td>
                    <td>{asegurado.cedula_propietario}</td>
                  </tr>
                  <tr>
                    <td>Correo</td>
                    <td>{asegurado.correo}</td>
                  </tr>
                  <tr>
                    <td>Fecha de nacimiento</td>
                    <td>{new Date(asegurado.fecha_nacimiento).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>Teléfono</td>
                    <td>{asegurado.telefono}</td>
                  </tr>
                  <tr>
                    <td>Ciudad</td>
                    <td>{asegurado.ciudad}</td>
                  </tr>
                  <tr>
                    <td>Estado</td>
                    <td>{asegurado.estado}</td>
                  </tr>
                  <tr>
                    <td>Municipio</td>
                    <td>{asegurado.municipio}</td>
                  </tr>
                  <tr>
                    <td>Dirección</td>
                    <td>{asegurado.direccion}</td>
                  </tr>
                </tbody>
              </table>

              <h4>Pagos:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Prima Básica</th>
                    <th>Prima Total</th>
                    <th>Suma Cosas</th>
                    <th>Suma Personas</th>
                    <th>Coberturas Adicionales</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosMostrados
                    .filter((pago) => pago.id_asegurado === asegurado.id)
                    .map((pago) => (
                      <tr key={pago.id}>
                        <td>{pago.plan}</td>
                        <td>{pago.prima_basica_dlrs}</td>
                        <td>{pago.prima_total_dlrs}</td>
                        <td>{pago.suma_cosas_dlrs}</td>
                        <td>{pago.suma_personas_dlrs}</td>
                        <td>{pago.extra_plan}</td>
               
                      </tr>
                    ))}
                </tbody>
              </table>
  
              {asegurado.imagen_cedula && (
                <div>
                  <p><strong>Imagen Cédula:</strong></p>
                  <img src={asegurado.imagen_cedula} alt="Imagen Cédula" style={{ width: "100px", height: "auto" }} />
                  {/* <button onClick={() => handleImageDownload(asegurado.imagen_cedula)}>
                    Descargar Imagen
                  </button> */}
                </div>
              )}
  
              <h4>Vehículos:</h4>
              {vehiculos
                .filter((vehiculo) => vehiculo.id_asegurado === asegurado.id)
                .map((vehiculo) => (
                  <div key={vehiculo.id}>
                    <p><strong>Carnet de Circulación:</strong></p>
                    <img src={vehiculo.imagen_vehiculo} alt="Imagen Vehículo" style={{ width: "100px", height: "auto" }} />
                    {/* <button onClick={() => handleImageDownload(vehiculo.imagen_vehiculo)}>
                      Descargar Imagen
                    </button> */}
                  </div>
                ))}
  
          
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
}