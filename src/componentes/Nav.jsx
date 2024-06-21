// src/componentes/Nav.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Nav.css';
import logo from '../assets/logo.png';

export default function Nav() {
  return (
    <nav className="nav">
      <img className='logo-nav' src={logo} alt="Logo" />
      <ul>
        <li><Link to="/asociados">Asociados</Link></li>
        <li><Link to="/vendidos">vendidos</Link></li>
        <li><Link to="/reportes">Reportes</Link></li>
      </ul>
    </nav>
  );
}
