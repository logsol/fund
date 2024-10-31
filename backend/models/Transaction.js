const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  crewMember: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  cancelReason: { type: String, default: null },
});

module.exports = mongoose.model('Transaction', transactionSchema);
