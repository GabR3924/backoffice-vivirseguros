// src/componentes/Asociados.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../CSS/Asociados.css";
import urls from "../routes";

const Asociados = () => {
  const [tiendas, setTiendas] = useState([]);
  const [nuevaTienda, setNuevaTienda] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTienda, setSelectedTienda] = useState(null);

  const handleShowModal = (tienda) => {
    setSelectedTienda(tienda);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTienda(null);
  };

  const obtenerTiendas = () => {
    console.log("Llamando al servidor para obtener tiendas...");
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/get-intermediarios")
      .then((response) => {
        if (response.data) {
          console.log("Tiendas obtenidas:", response.data);
          setTiendas(response.data);
        } else {
          console.error("La respuesta del servidor no contiene los datos esperados.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener las tiendas:", error);
      });
  };

  useEffect(() => {
    obtenerTiendas();
  }, []);

  const handleCreateTienda = () => {
    axios
      .post("https://rcv.gocastgroup.com:2053/vivirseguros/agregar-intermediarios", nuevaTienda)
      .then((response) => {
        console.log("Tienda creada correctamente");
        obtenerTiendas();
        setNuevaTienda({
          nombre: "",
          codigo: "",
          categoria: "",
        });
      })
      .catch((error) => {
        console.error("Error al crear la tienda:", error);
      });
  };

  const handleDeleteTienda = (codigo) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tienda?")) {
      axios
        .delete('https://rcv.gocastgroup.com:2053/vivirseguros/eliminar-intermediario', {
          data: { codigo },
        })
        .then((response) => {
          console.log("Tienda eliminada correctamente");
          obtenerTiendas();
        })
        .catch((error) => {
          console.error("Error al eliminar la tienda:", error);
        });
    }
  };

  return (
    <div className="asociados">
      <h1>Asociados</h1>
      <h2>Tiendas/Usuario</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTienda();
        }}
      >
        <input
          type="text"
          value={nuevaTienda.nombre}
          onChange={(e) => setNuevaTienda({ ...nuevaTienda, nombre: e.target.value })}
          placeholder="Nombre de la Tienda/Usuario"
        />
        <input
          type="text"
          value={nuevaTienda.codigo}
          onChange={(e) => setNuevaTienda({ ...nuevaTienda, codigo: e.target.value })}
          placeholder="Código"
        />
        <input
          type="text"
          value={nuevaTienda.categoria}
          onChange={(e) => setNuevaTienda({ ...nuevaTienda, categoria: e.target.value })}
          placeholder="Categoría"
        />
        <button type="submit">Agregar Tienda/Usuario</button>
      </form>
      <div className="grid-container">
        {tiendas.map((tienda) => (
          <div key={tienda.id} className="tienda-card">
            <div className="view-tienda">
              <span>{tienda.nombre}</span>
              <span>{tienda.codigo}</span>
              <button onClick={() => handleShowModal(tienda)}>Ver más</button>
              <button onClick={() => handleDeleteTienda(tienda.codigo)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedTienda && (
        <div className="modal-asociados">
          <div className="modal-content">
            <span>{selectedTienda.nombre}</span>
            <span>{selectedTienda.codigo}</span>
            <a href={selectedTienda.url} target="blank">link</a>
            {selectedTienda.qr ? (
              <img
                src={`data:image/png;base64,${selectedTienda.qr}`}
                alt={`QR de ${selectedTienda.nombre}`}
              />
            ) : (
              <p>No QR Available</p>
            )}
            <button onClick={handleCloseModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asociados;
