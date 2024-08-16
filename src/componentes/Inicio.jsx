import React, { useState, useEffect } from "react";
import axios from 'axios';
import { CSVLink } from "react-csv";
import "../CSS/Inicio.css";

const Inicio = () => {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [datos, setDatos] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setDatos(response.data);  // Guardar todos los datos
        prepararCSV(response.data);  // Preparar datos para CSV
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

    return () => clearInterval(timer);
  }, []);

  const prepararCSV = (datos) => {
    const { propietarios, vehiculos, pagos } = datos;

    // Verificar que existen datos suficientes para construir el CSV
    if (!propietarios || !vehiculos || !pagos || propietarios.length === 0) {
      console.log("No hay suficientes datos disponibles para generar el reporte.");
      return;
    }

    // Convertir los datos en un array de objetos adecuado para CSVLink
    const dataForCSV = propietarios.map((propietario, index) => {
      const vehiculo = vehiculos[index] || {}; 
      const pago = pagos[index] || {}; 

      return {
        "Cédula": propietario.cedula_propietario,
        "Nombre": propietario.nombre_propietario,
        "Apellido": propietario.apellido_propietario,
        "Fecha de Nacimiento": new Date(propietario.fecha_nacimiento).toLocaleDateString(),
        "Género": propietario.genero,
        "Estado Civil": propietario.estado_civil,
        "Teléfono": propietario.telefono,
        "Correo": propietario.correo,
        "Ciudad": propietario.ciudad,
        "Estado": propietario.estado,
        "Municipio": propietario.municipio,
        "Dirección": propietario.direccion,
        "Marca Vehículo": vehiculo.marca_vehiculo || "",
        "Serial Vehículo": vehiculo.serial_vehiculo || "",
        "Placa Vehículo": vehiculo.placa_vehiculo || "",
        "Año Vehículo": vehiculo.ano_vehiculo || "",
        "Referencia Pago": pago.paymentData_referencia || "",
        "Monto Pago": pago.paymentData_monto || "",
        "Banco Pago": pago.paymentData_banco || "",
        "Plan": pago.plans || "",
        "Extra Plan": pago.extra_plans || ""
      };
    });

    // Actualizar el estado con los datos formateados para CSV
    setCsvData(dataForCSV);
  };

  return (
    <div className="head">
      <div className="saludo-container">
        <h1>¡Hola! Bienvenido</h1>
        <p>{fechaHora.toLocaleString()}</p>
      </div>

      <div className="reportes-container">
        <h1>Reportes</h1>
        <CSVLink 
          data={csvData} 
          filename={"reporte_completo.csv"}
          className="btn btn-primary"
        >
          Descargar CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default Inicio;
