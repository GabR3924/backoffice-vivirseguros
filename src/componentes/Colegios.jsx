import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Colegios.css'; 

export default function Colegios() {
  const [alumnos, setAlumnos] = useState([]);
  const [pagosAlumnos, setPagosAlumnos] = useState([]);
  const [alumnosMostrados, setAlumnosMostrados] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const alumnosLimitados = alumnosMostrados.slice(0, 10);

  const cargarAlumnos = async () => {
    try {
      const response = await axios.get("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos");
      const alumnosData = response.data.alumno || [];
      setAlumnos(alumnosData);
      setPagosAlumnos(response.data.pagos_alumnos || []);

      const fechasUnicas = [...new Set(alumnosData.map(alumno => new Date(alumno.fecha_nacimiento).toLocaleDateString()))];
      setFechas(fechasUnicas);
      setAlumnosMostrados(alumnosData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  useEffect(() => {
    cargarAlumnos(); // Llamada inicial para cargar alumnos
  }, []);

  const manejarSeleccionFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    const alumnosFiltrados = alumnos.filter(alumno => 
      new Date(alumno.fecha_nacimiento).toLocaleDateString() === fecha
    );
    setAlumnosMostrados(alumnosFiltrados);
  };

  const quitarFiltro = () => {
    setAlumnosMostrados(alumnos); 
    setFechaSeleccionada(""); 
  };

  const descargarImagen = (imagenCedula, nombre, apellido) => {
    if (imagenCedula && imagenCedula.data) {
      const blob = new Blob([new Uint8Array(imagenCedula.data)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const nombreArchivo = `${nombre.trim()}_${apellido.trim()}.jpg`; // Usar nombre y apellido para el nombre del archivo
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo; // Asignar el nombre del archivo
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Liberar memoria
    }
  };

  const obtenerPagosAlumno = (idAlumno) => {
    return pagosAlumnos.filter(pago => pago.id_alumno === idAlumno);
  };

  return (
    <div className="colegios">
      <h2>Datos de Alumnos y Pagos</h2>

      <select 
        value={fechaSeleccionada} 
        onChange={(e) => manejarSeleccionFecha(e.target.value)}
      >
        <option value="">Selecciona una fecha</option>
        {fechas.map((fecha, index) => (
          <option key={index} value={fecha}>{fecha}</option>
        ))}
      </select>

      <button onClick={quitarFiltro} disabled={!fechaSeleccionada}>
        Quitar Filtro
      </button>

      <h3>Alumnos</h3>
      <div className="grid-container">
        {alumnosLimitados.length > 0 ? (
          alumnosLimitados.map((alumno) => (
            <div key={alumno.id} className="alumno">
              <p className="fecha">
                Fecha de Nacimiento: {new Date(alumno.fecha_nacimiento).toLocaleDateString()}
              </p>
              <p><strong>Nombre:</strong> {alumno.nombre}</p>
              <p><strong>Apellido:</strong> {alumno.apellido}</p>

              {/* Botón para descargar la imagen */}
              <button 
                onClick={() => descargarImagen(alumno.imagen_cedula, alumno.nombre, alumno.apellido)}
              >
                Descargar Imagen de Cédula
              </button>

              <h4>Pagos del Alumno</h4>
              {obtenerPagosAlumno(alumno.id).length > 0 ? (
                obtenerPagosAlumno(alumno.id).map((pago) => (
                  <div key={pago.id} className="pago">
                    <p><strong>Fecha de Pago:</strong> {new Date(pago.fecha_pago).toLocaleDateString()}</p>
                    <p><strong>Monto:</strong> {pago.monto}</p>
                    <p><strong>Referencia:</strong> {pago.referencia}</p>
                    <p><strong>Plan:</strong> {pago.plan}</p>
                  </div>
                ))
              ) : (
                <p>No se encontraron pagos para este alumno.</p>
              )}
            </div>
          ))
        ) : (
          <p>No se encontraron alumnos para la fecha seleccionada.</p>
        )}
      </div>
    </div>
  );
}
