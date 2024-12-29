import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // If no token, redirect to login
    } else {
      const decodedToken = jwtDecode(token); // Decode the JWT token
      setUserEmail(decodedToken.email); // Assuming your token contains the user's email
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 text-center">
        <h2>Welcome, {userEmail}</h2>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
