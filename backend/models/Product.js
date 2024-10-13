const mongoose = require('mongoose');
const { addChangeHistory } = require('../utils/modelUtils');

const productSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['entrance', 'drink', 'food', 'merchandise'], required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

addChangeHistory(productSchema);

module.exports = mongoose.model('Product', productSchema);
