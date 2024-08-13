import React, { useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const Reportes = () => {

  useEffect(() => {
    axios
      .get('https://rcv.gocastgroup.com:2053/vivirseguros/obtener-datos')
      .then((response) => {
        console.log('usuarios', response.data);
        // Filtrar y formatear los datos
        const data = response.data.map(usuario => ({
          nombre: `${usuario.datos_nombre} ${usuario.datos_apellido}`,
          cedula: usuario.datos_cedula,
          auto: `${usuario.marca} ${usuario.modelo}`,
          fecha: usuario.ano,
        }));
        generarCSV(data);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  const generarCSV = (data) => {
    // Mapear los datos a un formato compatible con PapaParse
    const csvData = data.map(entry => ({
      Nombre: entry.nombre,
      Cédula: entry.cedula,
      Auto: entry.vehiculo,
      Fecha: entry.fecha,
    }));

    // Generar el CSV utilizando PapaParse
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reporte.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Reportes</h2>
      {/* Aquí puedes agregar contenido adicional para la interfaz de usuario si es necesario */}
    </div>
  );
};

export default Reportes;
