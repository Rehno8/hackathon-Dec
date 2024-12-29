import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Spinner, Modal, Button, Form } from 'react-bootstrap'; // Import Bootstrap components

const Event = () => {
  const [events, setEvents] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');

  // State for Modal and form data
  const [showModal, setShowModal] = useState(false);
  const [editEventData, setEditEventData] = useState({
    _id: '',
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    visibility: '',
  });
  const [isSaving, setIsSaving] = useState(false); // For handling save button spinner

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5006/events', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            category: filterCategory,
            date: filterDate,
            visibility: filterVisibility,
          },
        });

        if (Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          setEvents([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filterCategory, filterDate, filterVisibility]);

  const handleEditClick = (event) => {
    setEditEventData({
      _id: event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().split('T')[0], // Format date for input
      category: event.category,
      visibility: event.visibility,
    });
    setShowModal(true); // Show the modal on edit click
  };

  const handleSaveChanges = async () => {
    setIsSaving(true); // Show spinner while saving
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to edit an event');
      setIsSaving(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5006/api/edit-event/${editEventData._id}`,
        { token, ...editEventData }
      );

      if (response.status === 200) {
        setEvents(
          events.map((event) =>
            event._id === editEventData._id ? { ...event, ...editEventData } : event
          )
        );
        alert('Event updated successfully');
        setShowModal(false); // Close modal
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    } finally {
      setIsSaving(false); // Hide spinner
    }
  };

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to delete an event');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5006/api/delete-event/${eventId}`, {
        data: { token },
      });

      if (response.status === 200) {
        setEvents(events.filter((event) => event._id !== eventId));
        alert('Event deleted successfully');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1 className="text-center text-success mb-5">Event Dashboard</h1>
              <div className="filter-container">
                <select onChange={(e) => setFilterCategory(e.target.value)} className="form-control">
                  <option value="">All Categories</option>
                  <option value="tech">Tech</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="form-control my-3"
                />
                <select onChange={(e) => setFilterVisibility(e.target.value)} className="form-control">
                  <option value="">All Events</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Link to="/addEvent" className="btn btn-info mb-4">
                  Add Event
                </Link>
              </div>
              <div className="row">
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  events.map((event) => (
                    <div className="col-md-4 mb-4" key={event._id}>
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{event.title}</h5>
                          <p className="card-text">
                            <strong>Category:</strong> {event.category}<br />
                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}<br />
                            <strong>Status:</strong> {event.status}<br />
                            <strong>Visibility:</strong> {event.visibility}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button
                              onClick={() => handleEditClick(event)}
                              className="btn btn-warning"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Editing Event */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.title}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="eventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.description}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="eventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.location}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, location: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="eventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editEventData.date}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="eventCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={editEventData.category}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, category: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="eventVisibility">
              <Form.Label>Visibility</Form.Label>
              <Form.Control
                as="select"
                value={editEventData.visibility}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, visibility: e.target.value })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Event;
