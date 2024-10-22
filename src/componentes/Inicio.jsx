import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Inicio.css";

const Inicio = () => {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [datos, setDatos] = useState([]);
  const [datosColegios, setDatosColegios] = useState([]);
  const [tasaDia, setTasaDia] = useState("");

  useEffect(() => {
    // Hacer la petición a la API para obtener los datos
    axios
      .get("https://apidev.gocastgroup.com/api/tasa_dia.php")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setTasaDia(response.data);  // Almacenar todos los datos recibidos
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

   
  }, []);

  useEffect(() => {
    // Configurar el temporizador para actualizar la fecha y la hora cada segundo
    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    // Hacer la petición a la API para obtener los datos
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/colegios-datos")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setDatosColegios(response.data);  // Almacenar todos los datos recibidos
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

    // Limpiar el temporizador cuando se desmonte el componente
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Configurar el temporizador para actualizar la fecha y la hora cada segundo
    const timer = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    // Hacer la petición a la API para obtener los datos
    axios
      .get("https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setDatos(response.data);  // Almacenar todos los datos
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });

    // Limpiar el temporizador cuando se desmonte el componente
    return () => clearInterval(timer);
  }, []);

  // Función para generar el reporte basado en los datos obtenidos
  const generarReporte = () => {
    const { propietarios, vehiculos, pagos } = datos;
  
    if (!propietarios || !vehiculos || !pagos || propietarios.length === 0) {
      console.log("No hay suficientes datos disponibles para generar el reporte.");
      return;
    }
  
    // Creación del CSV
    const csvData = [
      [
        "Cédula", "Nombre", "Apellido", "Fecha de Nacimiento", "Género",
        "Teléfono", "Correo", "Ciudad", "Estado", "Municipio", "Dirección", 
        "Marca Vehículo", "Serial Vehículo", "Placa Vehículo", "Año Vehículo", 
        "Referencia Pago", "Monto Pago", "Banco Pago", "Plan", "Extra Plan"
      ],
      ...propietarios.map((propietario, index) => {
        const vehiculo = vehiculos[index] || {}; // Asegúrate de que haya un vehículo para este propietario
        const pago = pagos[index] || {}; // Asegúrate de que haya un pago para este propietario
  
        return [
          propietario.cedula_propietario,
          propietario.nombre_propietario,
          propietario.apellido_propietario,
          new Date(propietario.fecha_nacimiento).toLocaleDateString(),
          propietario.genero,
          propietario.telefono,
          propietario.correo,
          propietario.ciudad,
          propietario.estado,
          propietario.municipio,
          propietario.direccion,
          vehiculo.marca_vehiculo,
          vehiculo.serial_vehiculo,
          vehiculo.placa_vehiculo,
          vehiculo.ano_vehiculo,
          pago.referencia,
          pago.monto,
          pago.banco,
          pago.plan,
          pago.extra_plan
        ];
      })
    ];
  
    // Generación del archivo CSV
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvData.map(e => e.join(";")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_completo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generarReporteColegios = () => {
    // Verificar que los datos estén en la estructura esperada
    if (!datosColegios || datosColegios.length === 0) {
      console.log("No hay datos disponibles para generar el reporte.");
      return;
    }
  
    const alumno = datosColegios.alumno || []; // Asegúrate de que `alumno` esté definido
    const pagos_alumnos = datosColegios.pagos_alumnos || []; // Asegúrate de que `pagos_alumnos` esté definido
  
    if (alumno.length === 0 || pagos_alumnos.length === 0) {
      console.log("No hay suficientes datos de alumno o pagos para generar el reporte.");
      return;
    }
  
    // Creación del CSV
    const csvData = [
      [
        "Cédula", "Nombre", "Apellido", "Fecha de Nacimiento", "Teléfono", 
        "Correo", "Estado", "Dirección", "Fecha de Inicio", "Referencia Pago", 
        "Monto Pago", "Banco Pago", "Plan"
      ],
      ...alumno.map((alumno, index) => {
        const pago = pagos_alumnos[index] || {}; // Asegúrate de que haya un pago para este alumno
  
        return [
          alumno.cedula || "",
          alumno.nombre || "",
          alumno.apellido || "",
          new Date(alumno.fecha_nacimiento).toLocaleDateString() || "",
          alumno.telefono || "",
          alumno.correo || "",
          alumno.estado || "",
          alumno.direccion || "",
          new Date(alumno.fecha_inicio).toLocaleString() || "",  // Agrega la fecha y hora de inicio
          pago.referencia || "",
          pago.monto || "",
          pago.banco || "",
          pago.plan || ""
        ];
      })
    ];
  
    // Generación del archivo CSV
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvData.map(e => e.join(";")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_completo.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="head">
      <div className="saludo-container">
        <h1>¡Hola! Bienvenido</h1>
        <p>{fechaHora.toLocaleString()}</p>
        <h3>Tasa del dia
          <br />
          <span>{tasaDia}</span>
        </h3>
      </div>

      <div className="reportes-container">
        <h1>Reportes</h1>
        <button onClick={generarReporte}>Generar Reporte RCV</button>
      </div>

      <div className="reportes-container">
        <h1>Reporte de Colegios</h1>
        <button onClick={generarReporteColegios}>Generar Reporte de Colegios</button>
      </div>
    </div>
  );
};

export default Inicio;
