// src/pages/Events/AddEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEvent = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState('public');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !location || !description || !date || !category) {
      alert('All fields are required!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5006/api/create',
        { title, location, description, date, category, visibility, token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        navigate('/event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Create New Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Event Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="tech">Tech</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div className="mb-3">
                  <select
                    className="form-select"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit">
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
