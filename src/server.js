const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const questionRoutes = require('./routes/questions');
const submissionRoutes = require('./routes/submissions');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://vinit-pat.github.io/Assess-FE', // Match your frontend URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow credentials (cookies, headers)
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codex-simple';
mongoose.connect(MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Coding Challenge Platform Backend!');
});

// JDoodle Code Execution Route
app.post('/api/execute', async (req, res) => {
  const { script, language, versionIndex } = req.body;

  if (!script || !language || !versionIndex) {
    return res.status(400).json({ error: 'Missing required fields: script, language, versionIndex' });
  }

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      script,
      language,
      versionIndex,
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Execution error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Code execution failed' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
