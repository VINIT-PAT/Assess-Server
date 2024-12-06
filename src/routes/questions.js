const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// POST endpoint to add a new question
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ error: 'Title, description, and difficulty are required' });
    }

    const question = new Question({ title, description, difficulty });
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

module.exports = router;
