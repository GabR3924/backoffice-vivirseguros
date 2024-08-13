// src/componentes/Asociados.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import '../CSS/Asociados.css'
import urls from "../routes";

const Asociados = () => {
  const [tiendas, setTiendas] = useState([]);
  const [nuevaTienda, setNuevaTienda] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
  });
  const [editTiendaId, setEditTiendaId] = useState(null);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [indexOfLastItem, setIndexOfLastItem] = useState(10);

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

  const handleTiendaInputChange = (id, value) => {
    const updatedTiendas = tiendas.map((tienda) =>
      tienda.id === id ? { ...tienda, nombre: value } : tienda
    );
    setTiendas(updatedTiendas);
  };

  const handleUpdateTienda = (id, nombre) => {
    // Aquí iría la lógica para actualizar la tienda en el backend
    setEditTiendaId(null);
  };

  const handleDeleteTienda = (codigo) => {
    axios
      .delete("https://rcv.gocastgroup.com:2053/vivirseguros/eliminar-intermediario", {
        data: { codigo }
      })
      .then((response) => {
        console.log("Tienda eliminada correctamente");
        // Actualiza el estado para reflejar la eliminación
        setTiendas(tiendas.filter((tienda) => tienda.codigo !== codigo));
      })
      .catch((error) => {
        console.error("Error al eliminar la tienda:", error);
      });
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
          onChange={(e) =>
            setNuevaTienda({ ...nuevaTienda, nombre: e.target.value })
          }
          placeholder="Nombre de la Tienda/Usuario"
        />
        <input
          type="text"
          value={nuevaTienda.codigo}
          onChange={(e) =>
            setNuevaTienda({ ...nuevaTienda, codigo: e.target.value })
          }
          placeholder="Código"
        />
        <input
          type="text"
          value={nuevaTienda.categoria}
          onChange={(e) =>
            setNuevaTienda({ ...nuevaTienda, categoria: e.target.value })
          }
          placeholder="Categoría"
        />
        <button type="submit">Agregar Tienda/Usuario</button>
      </form>
      <ul>
        {tiendas.slice(indexOfFirstItem, indexOfLastItem).map((tienda) => (
          <li key={tienda.codigo} className="tienda-item">
            {editTiendaId === tienda.codigo ? (
              <div className="edit-tienda">
                <input
                  type="text"
                  value={tienda.nombre}
                  onChange={(e) =>
                    handleTiendaInputChange(tienda.codigo, e.target.value)
                  }
                />
                <button
                  onClick={() => handleUpdateTienda(tienda.codigo, tienda.nombre)}
                >
                  Guardar
                </button>
              </div>
            ) : (
              <div className="view-tienda">
                <span>{tienda.codigo}</span>
                <span>{tienda.nombre}</span>
                {tienda.qr ? (
                  <img
                    src={`data:image/png;base64,${tienda.qr}`}
                    alt={`QR de ${tienda.nombre}`}
                  />
                ) : (
                  <p>No QR Available</p>
                )}
                <FaEdit
                  className="iconAdmin"
                  onClick={() => setEditTiendaId(tienda.codigo)}
                />
              </div>
            )}
            <FaTrash
              className="iconAdmin"
              onClick={() => handleDeleteTienda(tienda.codigo)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Asociados;
