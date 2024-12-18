require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');

async function installDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log('Dropped existing database');

    // Create users
    const crewUser = await User.create({
      email: 'crew@example.com',
      name: 'Crew Member',
      password: '$2b$10$WPnwQz8msVAzalehPq6VLuTlrwag3xoJIh8e1fyibmNkA/7.EmUSO', // mannoman
      isCrew: true,
      balance: 100
    });

    const regularUser = await User.create({
      email: 'user@example.com',
      name: 'Regular User',
      password: '$2b$10$WPnwQz8msVAzalehPq6VLuTlrwag3xoJIh8e1fyibmNkA/7.EmUSO', // mannoman
      balance: 23
    });

    console.log('Created users');

    // Create an event
    const event = await Event.create({
      name: 'Summer Festival',
      description: 'Annual summer music festival',
      date: new Date('2023-07-15'),
      createdBy: crewUser._id
    });

    console.log('Created event');

    // Create products
    const entranceTicket = await Product.create({
      event: event._id,
      name: 'General Admission',
      description: 'Entrance ticket for Summer Festival',
      type: 'entrance',
      price: 12
    });

    const beerProduct = await Product.create({
      event: event._id,
      name: 'Beer',
      description: 'Craft beer',
      type: 'drink',
      price: 4
    });

    console.log('Created products');

    // Create transactions
    await Transaction.create({
      user: regularUser._id,
      amount: 12,
      items: [{ name: 'Entrance', price: 12, quantity: 1 }],
      crewMember: crewUser._id,
      status: 'paid'
    });

    await Transaction.create({
      user: regularUser._id,
      amount: 10,
      items: [{ name: 'Beer', price: 4, quantity: 2 }],
      amount: 8,
      crewMember: crewUser._id,
      status: 'paid'
    });

    console.log('Created transactions');

    console.log('Database installation completed successfully');
  } catch (error) {
    console.error('Error installing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

installDB();
