import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register/', {
        username,
        email,
        password,
      });
      alert(response.data.message);
      navigate('/login'); // go to login after successful register
    } catch (error) {
      alert(error.response.data.error || 'Registration failed');
    }
  };

  return (
    <div className='container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required /><br/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
