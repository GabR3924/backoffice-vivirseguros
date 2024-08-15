import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Nav from './componentes/Nav';
import Asociados from './componentes/Asociados';
import Reportes from './componentes/Reportes';
import Clientes from './componentes/Vendidos';
import Login from './componentes/Login';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/*" 
          element={authenticated ? <MainContent /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

function MainContent() {
  return (
    <div className='main-content'>
      <Nav />
      <div className="content">
      <Routes>
        <Route path="/" element={<Asociados />} />
        <Route path="/about" element={<Asociados />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/clientes" element={<Clientes />} />
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/about" />} />
      </Routes>
      </div>
    </div>
  );
}

export default App;
