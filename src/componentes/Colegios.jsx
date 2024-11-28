import React, { useState, useEffect } from "react";
import axios from "axios";

const Formulario = () => {
  const [data, setData] = useState([]); // Para almacenar los datos obtenidos de la API
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  // Esta función se ejecuta cuando el componente se monta o cuando cambia la página
  const fetchData = async (page) => {
    try {
      const response = await axios.get(
        "https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos-v",
        {
          params: {
            page: page,  // Página actual
            limit: 4,     // Limite de elementos por página
          },
        }
      );
      console.log("Datos obtenidos:", response.data); // Verifica los datos en la consola
      setData(response.data.alumno); // Actualiza el estado con los datos
      setTotalPages(response.data.totalPages); // Actualiza el total de páginas
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchData(page); // Llamada a la API cuando el componente se monta o cuando cambia la página
  }, [page]); // Dependencia en `page` para que se recargue cuando cambie la página

  // Funciones para cambiar de página
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Avanzar a la siguiente página
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1); // Volver a la página anterior
    }
  };

  // Función para descargar la imagen
  const handleDownloadImage = (base64Image) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = "imagen_cedula.png"; // Nombre del archivo
    link.click();
  };

  return (
    <div>
      <h2>Datos Cargados</h2>

      {/* Muestra la lista de datos obtenidos de la API */}
      <div className="cards-container">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="card">
              <h3>{item.nombre}</h3>
              <p><strong>Cédula:</strong> {item.cedula}</p>
              <p><strong>Fecha de Inicio:</strong> {item.fecha_inicio}</p>
              {item.imagen_cedula && (
                <div>
                  <strong>Imagen:</strong>
                  <img
                    src={`data:image/png;base64,${item.imagen_cedula}`}
                    alt={`Imagen de ${item.nombre}`}
                    width="100"
                  />
                  <button onClick={() => handleDownloadImage(item.imagen_cedula)}>
                    Descargar Imagen
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>

      {/* Botones de paginado */}
      <div>
        <button onClick={handlePrevPage} disabled={page === 1}>Anterior</button>
        <span> Página {page} de {totalPages} </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Siguiente</button>
      </div>
    </div>
  );
};

export default Formulario;
