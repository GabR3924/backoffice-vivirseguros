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
      {/* Renderizar el componente Nav solo si el usuario está autenticado */}
      {authenticated && <Nav />}
      <div className="contenido">
        <Routes>
          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={authenticated ? <Asociados /> : <Navigate to="/login" />} />
          <Route path="/asociados" element={authenticated ? <Asociados /> : <Navigate to="/login" />} />
          <Route path="/reportes" element={authenticated ? <Reportes /> : <Navigate to="/login" />} />
          <Route path="/vendidos" element={authenticated ? <Vendidos /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
