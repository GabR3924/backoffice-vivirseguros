import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Intentando iniciar sesión con:", username, password); // Verifica usuario y contraseña antes de enviar la solicitud
      
      const response = await axios.post('https://rcv.gocastgroup.com:3100/login', { username, password });
      
      console.log("Respuesta del servidor:", response); // Verifica la respuesta del servidor
      
      setAuthenticated(true);
      navigate('/'); // Redirige al usuario a la página principal después del login
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setError('Error: Ha ocurrido un problema durante el inicio de sesión.');
    }
  };

  return (
    <div>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
