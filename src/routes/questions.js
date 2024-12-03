// routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// POST endpoint to add a new question
router.post('/', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error('Error saving question:', error);
    res.status(500).json({ error: 'Error saving question' });
  }
});

// GET endpoint to fetch all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// DELETE endpoint to delete a question by ID
// DELETE endpoint to delete a question
router.delete('/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});


module.exports = router;
