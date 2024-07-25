import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/Login.css';
import urls from '../routes';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Intentando iniciar sesión con:", username, password); 
      const response = await axios.post("https://rcv.gocastgroup.com:3000/login", { username, password });
      
      console.log(response.data);
      
      setAuthenticated(true);
      navigate('/'); // Redirige al usuario a la página principal después del login
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setError('Error: Ha ocurrido un problema durante el inicio de sesión.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
