import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Nav from './componentes/Nav';
import Asociados from './componentes/Asociados';
import Reportes from './componentes/Reportes';
import Vendidos from './componentes/Vendidos';
import Login from './componentes/Login';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      {authenticated ? (
        <div id="app-container">
          {/* Renderizar el componente Nav solo si el usuario está autenticado */}
          <div className="nav"><Nav /></div>
          <div className="contenido">
            <Routes>
              {/* Rutas protegidas */}
              <Route path="/" element={<Asociados />} />
              <Route path="/asociados" element={<Asociados />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/vendidos" element={<Vendidos />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
