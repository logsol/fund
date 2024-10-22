const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Event = require('../models/Event');
const User = require('../models/User');

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { crewMember, amount, items, eventId } = req.body;

    // Validate input
    if (!crewMember || !amount || !items || !eventId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if crew member exists
    const user = await User.findById(crewMember);
    if (!user || !user.isCrew) {
      return res.status(404).json({ message: 'Crew member not found' });
    }

    // Iterate through items copy into transactionItems
    const transactionItems = items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    // Create new transaction
    const newTransaction = new Transaction({
      crewMember,
      amount,
      items: transactionItems,
      eventId
    });

    // Save transaction
    const savedTransaction = await newTransaction.save();

    // Return the transaction
    res.status(201).json(savedTransaction);

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// add pay route where we associate the user with the transaction
router.post('/pay', async (req, res) => {
  try {
    const { userId, transactionId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'paid') {
      return res.status(400).json({ message: 'Transaction has already been paid' });
    }

    if (user.balance < transaction.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update transaction status
    transaction.status = 'paid';
    await transaction.save();

    // Deduct the amount from the user's balance
    user.balance -= transaction.amount;
    await user.save();

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error paying for transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
