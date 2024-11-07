import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Asegurados.css";

export default function Asegurados() {
  const [asegurados, setAsegurados] = useState([]);
  const [aseguradosMostrados, setAseguradosMostrados] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [vehiculos, setVehiculos] = useState([]); // Estado para los datos de vehículos

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log("asegurados", response.data);
        setAsegurados(response.data.asegurados);
        setAseguradosMostrados(response.data.asegurados);
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
        <input
          type="date"
          value={fechaFiltro}
          onChange={handleFechaFiltroChange}
        />
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
              <p><strong>Nombre:</strong> {asegurado.nombre_propietario}</p>
              <p><strong>Apellido:</strong> {asegurado.apellido_propietario}</p>
              <p><strong>Cédula:</strong> {asegurado.cedula_propietario}</p>
              <p><strong>Correo:</strong> {asegurado.correo}</p>
              <p><strong>Fecha de nacimiento:</strong> {new Date(asegurado.fecha_nacimiento).toLocaleDateString()}</p>
              <p><strong>Teléfono:</strong> {asegurado.telefono}</p>
              <p><strong>Ciudad:</strong> {asegurado.ciudad}</p>
              <p><strong>Estado:</strong> {asegurado.estado}</p>
              <p><strong>Municipio:</strong> {asegurado.municipio}</p>
              <p><strong>Dirección:</strong> {asegurado.direccion}</p>

              {/* Mostrar imagen con enlace para descargar */}
              {asegurado.imagen_cedula && (
                <div>
                  <p><strong>Imagen Cédula:</strong></p>
                  <img src={asegurado.imagen_cedula} alt="Imagen Cédula" style={{ width: "100px", height: "auto" }} />
                  <img src={asegurado.imagen_rif} alt="Imagen Rif" style={{ width: "100px", height: "auto" }} />
                  <button onClick={() => handleImageDownload(asegurado.imagen_cedula)}>Descargar Imagen</button>
                </div>
              )}

              {/* Mostrar la información de vehículos */}
              <h4>Vehículos:</h4>
              {vehiculos
                .filter((vehiculo) => vehiculo.id_asegurado === asegurado.id)
                .map((vehiculo) => (
                  <div key={vehiculo.id}>
                    <p><strong>Carnet de Circulación:</strong></p>
                    <img src={vehiculo.imagen_vehiculo} alt="Imagen Vehículo" style={{ width: "100px", height: "auto" }} />
                    <img src={vehiculo.imagen_propiedad} alt="Imagen propiedad" style={{ width: "100px", height: "auto" }} />
                    <button onClick={() => handleImageDownload(vehiculo.imagen_vehiculo)}>Descargar Imagen</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
