import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Colegios.css'; // Asegúrate de crear un archivo CSS

export default function Colegios() {
  const [alumnos, setAlumnos] = useState([]);
  const [pagosAlumnos, setPagosAlumnos] = useState([]);
  const [alumnosMostrados, setAlumnosMostrados] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  useEffect(() => {
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos")
      .then((response) => {
        console.log('Datos recibidos colegios:', response.data);
        const alumnosData = response.data.alumno || [];
        setAlumnos(alumnosData);
        setPagosAlumnos(response.data.pagos_alumnos || []);
        
        // Extraer fechas únicas de nacimiento
        const fechasUnicas = [...new Set(alumnosData.map(alumno => new Date(alumno.fecha_nacimiento).toLocaleDateString()))];
        setFechas(fechasUnicas);
        setAlumnosMostrados(alumnosData); // Inicialmente, mostrar todos los alumnos
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const manejarSeleccionFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    // Filtrar alumnos por la fecha seleccionada
    const alumnosFiltrados = alumnos.filter(alumno => 
      new Date(alumno.fecha_nacimiento).toLocaleDateString() === fecha
    );
    setAlumnosMostrados(alumnosFiltrados);
  };

  const quitarFiltro = () => {
    setAlumnosMostrados(alumnos); // Mostrar todos los alumnos
    setFechaSeleccionada(""); // Reiniciar la selección de fecha
  };

  // Convertir buffer de imagen a base64
  const convertirImagenABase64 = (imagenCedula) => {
    if (imagenCedula && imagenCedula.data) {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(imagenCedula.data))
      );
      return `data:image/jpeg;base64,${base64String}`;
    }
    return null;
  };

  // Filtrar los pagos correspondientes al id del alumno
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
        {alumnosMostrados.length > 0 ? (
          alumnosMostrados.map((alumno) => (
            <div key={alumno.id} className="alumno">
              <p className="fecha">
                Fecha de Nacimiento: {new Date(alumno.fecha_nacimiento).toLocaleDateString()}
              </p>
              <p><strong>Nombre:</strong> {alumno.nombre}</p>
              <p><strong>Apellido:</strong> {alumno.apellido}</p>

              {/* Mostrar imagen de cédula con opción de descarga */}
              {alumno.imagen_cedula ? (
                <>
                  <img
                    src={convertirImagenABase64(alumno.imagen_cedula)}
                    alt="Imagen de Cédula"
                    style={{ width: '200px', height: 'auto' }}
                  />
                  <a 
                    href={convertirImagenABase64(alumno.imagen_cedula)} 
                    download={`cedula_${alumno.nombre}_${alumno.apellido}.jpg`}>
                    Descargar Imagen de Cédula
                  </a>
                </>
              ) : (
                <p>No hay imagen de cédula disponible.</p>
              )}

              {/* Mostrar pagos correspondientes al alumno */}
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
