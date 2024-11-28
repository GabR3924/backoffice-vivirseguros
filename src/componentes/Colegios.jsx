import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Colegios.css'; 
import { ClipLoader } from 'react-spinners'; // Asegúrate de instalar react-spinners

export default function Colegios() {
  const [alumnos, setAlumnos] = useState([]);
  const [pagosAlumnos, setPagosAlumnos] = useState([]);
  const [alumnosMostrados, setAlumnosMostrados] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true); // Estado para controlar la carga
  const [paginaActual, setPaginaActual] = useState(1); // Estado para la página actual
  const alumnosPorPagina = 10; // Cantidad de alumnos por página

  // Calcular el índice inicial y final para la paginación
  const indiceInicial = (paginaActual - 1) * alumnosPorPagina;
  const indiceFinal = indiceInicial + alumnosPorPagina;
  const alumnosPaginados = alumnosMostrados.slice(indiceInicial, indiceFinal);

  const cargarAlumnos = async () => {
    setCargando(true); // Iniciar carga
    try {
      const response = await axios.get("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos-v");
      const alumnosData = response.data.alumno || [];
      setAlumnos(alumnosData);
      console.log(response.data)
      setAlumnosMostrados(alumnosData);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    } finally {
      setCargando(false); // Terminar carga
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
    setPaginaActual(1); // Reiniciar a la primera página cuando se selecciona una fecha
  };

  const quitarFiltro = () => {
    setAlumnosMostrados(alumnos); 
    setFechaSeleccionada(""); 
    setPaginaActual(1); // Reiniciar a la primera página
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

  // Funciones para cambiar de página
  const paginaSiguiente = () => {
    if (indiceFinal < alumnosMostrados.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  return (
    <div className="colegios">
      <h2>Datos de Alumnos y Pagos</h2>


        {/* Botones de paginación */}
        <div className="paginacion">
        <button onClick={paginaAnterior} disabled={paginaActual === 1}>
          Anterior
        </button>
        <span>Página {paginaActual}</span>
        <button onClick={paginaSiguiente} disabled={indiceFinal >= alumnosMostrados.length}>
          Siguiente
        </button>
      </div>

      <h3>Alumnos</h3>
      <div className="grid-container">
        {cargando ? ( // Mostrar el ícono de carga si se está cargando
          <div className="cargando">
            <ClipLoader color="#000" loading={cargando} size={50} />
            <p>Cargando...</p>
          </div>
        ) : alumnosPaginados.length > 0 ? (
          alumnosPaginados.map((alumno) => (
            <div key={alumno.id} className="alumno">
             
              <p><strong>Apellido:</strong> {alumno.cedula}</p>

              {/* Botón para descargar la imagen */}
              <button 
                onClick={() => descargarImagen(alumno.imagen_cedula, alumno.nombre)}
              >
                Descargar Imagen de Cédula
              </button>

            </div>
          ))
        ) : (
          <p>No se encontraron alumnos para la fecha seleccionada.</p>
        )}
      </div>

    
    </div>
  );
}
