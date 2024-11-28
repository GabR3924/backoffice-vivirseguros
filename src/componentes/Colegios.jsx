import React, { useState } from "react";
import axios from "axios";

const Formulario = () => {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [imagen, setImagen] = useState(null);

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="cedula">Cédula:</label>
        <input
          type="text"
          id="cedula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
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
  );
};

export default Formulario;
