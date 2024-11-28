import React, { useState, useEffect } from "react";
import axios from "axios";

const Formulario = () => {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [imagen, setImagen] = useState(null);
  const [data, setData] = useState([]);  // Para almacenar los datos obtenidos de la API

  // Esta función se ejecuta cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realiza una solicitud GET para obtener los datos de la API
        const response = await axios.get("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos-v");
        setData(response.data); // Asigna los datos a la variable 'data'
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []); // Este array vacío asegura que la solicitud se realice solo una vez al montar el componente

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData para enviar los datos al backend
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("cedula", cedula);
    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      const response = await axios.post("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos-v", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Formulario enviado correctamente", response.data);
    } catch (error) {
      console.error("Error al enviar el formulario", error);
    }
  };

  return (
    <div>
      <h2>Formulario</h2>

      {/* Muestra la lista de datos obtenidos de la API */}
      <div>
        <h3>Datos cargados:</h3>
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="data-item">
              <p><strong>Nombre:</strong> {item.nombre}</p>
              <p><strong>Cédula:</strong> {item.cedula}</p>
              {item.imagen && (
                <div>
                  <strong>Imagen:</strong>
                  <img src={item.imagen} alt={`Imagen de ${item.nombre}`} width="100" />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>

      {/* Formulario para agregar nuevos datos */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="cedula">Cédula:</label>
          <input
            type="text"
            id="cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imagen">Imagen:</label>
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;
