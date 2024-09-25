// src/componentes/Nav.js

import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Nav.css";
import logo from "../assets/figlogo.png";
import { CiBank } from "react-icons/ci";

export default function Nav() {
  return (
    <nav className="nav">
      <ul>
        <li>
          <CiBank />
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <CiBank />
          <Link to="/asociados">Asociados</Link>
        </li>
        <li>
          <CiBank />
          <Link to="/colegios">Colegios</Link>
        </li>
        {/* <li>
          <CiBank />
          <Link to="/clientes">Clientes</Link>
        </li> */}
      </ul>
    <div className="img-cont">
      <img className="logo-nav" src={logo} alt="Logo" />
    </div>
    </nav>
  );
}
