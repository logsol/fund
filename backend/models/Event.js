const mongoose = require('mongoose');
const { addChangeHistory } = require('../utils/modelUtils');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

addChangeHistory(eventSchema);

module.exports = mongoose.model('Event', eventSchema);
