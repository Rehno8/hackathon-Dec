const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ['tech', 'music', 'sports'],
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  }],
  status: {
    type: String,
    default: 'active'
  }
}, {
  collection: 'Events',
  timestamps: true
});

mongoose.model('Event', EventSchema);
