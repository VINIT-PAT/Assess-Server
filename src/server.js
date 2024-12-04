const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const questionRoutes = require('./routes/questions');
const submissionRoutes = require('./routes/submissions');
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust as needed for your frontend URL
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codex-simple');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



// Use Routes
app.use('/api/questions', questionRoutes);
app.use('/api/submissions', submissionRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Coding Challenge Platform Backend');
});

// Route for executing code
app.post('/api/execute', async (req, res) => {
    const { script, language, versionIndex } = req.body;
    
    try {
      const response = await axios.post('https://api.jdoodle.com/v1/execute', {
        script,
        language,
        versionIndex,
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      });
      console.log('Response from JDoodle:', response.data); // Log the response
      res.json(response.data);
    } catch (error) {
      console.error('Execution error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Execution error occurred' });
    }
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
