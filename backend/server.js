const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(express.json());
app.use(cors());  // Enable CORS
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");


const path = require('path');


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const mongoUrl =
  "mongodb+srv://bagabila:bagabila@cluster0.hkd1l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.error("Database connection failed:", e);
  });

require("./models/User");
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
    });

    res.status(201).json({ status: "ok", data: "User Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const oldUser = await User.findOne({ email: email });
  
    if (!oldUser) {
      return res.send({ data: "User doesn't exists!!" });
    }
  
    if (await bcrypt.compare(password, oldUser.password)) {
      const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
      console.log(token);
      if (res.status(201)) {
        return res.send({
          status: "ok",
          data: token
        });
      } else {
        return res.send({ error: "error" });
      }
    }
  });


  app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const useremail = user.email;
  
      User.findOne({ email: useremail }).then((data) => {
        return res.send({ status: "Ok", data: data });
      });
    } catch (error) {
      return res.send({ error: error });
    }
  });


  require('./models/Event');  // Ensure Event model is available 
  const Event = mongoose.model('Event');

 // Create Event Route
app.post('/api/create', async (req, res) => {
  const { title, description, location, date, category, visibility, token } = req.body;

  if (!token) {
    return res.status(400).json({ status: 'error', message: 'Token is required for authentication' });
  }

  try {
    // 1. Validate token and extract user info
    const decodedUser = jwt.verify(token, JWT_SECRET); // Verify token and extract user information
    const userEmail = decodedUser.email;

    // 2. Find the user based on the token email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // 3. Create the event, storing the user's ObjectId as an attendee
    const newEvent = await Event.create({
      title,
      description,
      location,
      date: new Date(date),  // Ensure the date is stored as a Date object
      category,
      visibility,
      attendees: [user._id]  // Adding the user's ObjectId as an attendee
    });

    // 4. Return success response with the created event
    res.status(201).json({ status: 'ok', message: 'Event created successfully', event: newEvent });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// server.js (backend)

app.get('/events', async (req, res) => {
  const { category, date, visibility } = req.query;
  
  try {
    // Build the query object for filtering events
    const query = {
      ...(category && { category }),
      ...(date && { date: { $gte: new Date(date) } }), // Filter by date if provided
      ...(visibility && { visibility }),
    };

    const events = await Event.find(query); // Apply filters to the Event model query
    res.status(200).json({ status: 'ok', data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});


// DELETE route to handle event deletion
app.delete('/api/delete-event/:id', async (req, res) => {
  const eventId = req.params.id; // Event ID from the URL
  const { token } = req.body; // Token from the request body
  
  if (!token) {
    return res.status(400).json({ status: 'error', message: 'Token is required for authentication' });
  }

  try {
    // Validate token and extract user info
    const decodedUser = jwt.verify(token, JWT_SECRET); // Verify token and extract user information
    const userEmail = decodedUser.email;

    // Find the user based on the token email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    // Ensure that only the event creator or an admin can delete the event
    if (event.attendees.includes(user._id) || user.role === 'admin') {
      // Delete the event
      await Event.findByIdAndDelete(eventId);
      res.status(200).json({ status: 'ok', message: 'Event deleted successfully' });
    } else {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to delete this event' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});


// PUT route to handle event update
app.put('/api/edit-event/:id', async (req, res) => {
  const eventId = req.params.id; // Event ID from the URL
  const { token, title, description, location, date, category, visibility } = req.body; // Extract event data and token
  
  if (!token) {
    return res.status(400).json({ status: 'error', message: 'Token is required for authentication' });
  }

  try {
    // Validate token and extract user info
    const decodedUser = jwt.verify(token, JWT_SECRET); // Verify token and extract user information
    const userEmail = decodedUser.email;

    // Find the user based on the token email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    // Ensure that only the event creator or an admin can edit the event
    if (event.attendees.includes(user._id) || user.role === 'admin') {
      // Update event details
      event.title = title || event.title;
      event.description = description || event.description;
      event.location = location || event.location;
      event.date = new Date(date) || event.date;
      event.category = category || event.category;
      event.visibility = visibility || event.visibility;

      // Save the updated event
      await event.save();

      res.status(200).json({ status: 'ok', message: 'Event updated successfully', event: event });
    } else {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to edit this event' });
    }
  } catch (error) {
    console.error('Error editing event:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

  

app.listen(5006, () => {
  console.log("Node js server started.");
});