// Server starter: initialize Sentry (optional), import the app and start listening after DB connects
require('dotenv').config();
// init Sentry early so errors during startup are captured
require('./sentry');
const http = require('http');
const mongoose = require('mongoose');
const { setupSockets } = require('./socket');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function start() {
  try {
    console.log('Starting server...');
    console.log('PORT:', PORT);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set in env, using localhost');
    } else {
      console.log('MONGODB_URI is set (not showing credentials)');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/projxpert');
    console.log('✅ MongoDB connected');

    setupSockets(server);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error(err);
    process.exit(1);
  }
}

start();
