import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Email format validation
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailFormat.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      // Make a POST request to the backend to authenticate the user
      const response = await axios.post('http://localhost:5006/login-user', {
        email,
        password,
      });

      if (response.data.status === 'ok') {
        localStorage.setItem('token', response.data.data); // Store token in localStorage
        navigate('/frontend'); // Redirect to home after successful login
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-danger">{error}</div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}
