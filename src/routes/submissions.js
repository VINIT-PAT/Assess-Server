const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// POST endpoint to add a new submission
router.post('/', async (req, res) => {
  const { questionId, code, output } = req.body;

  if (!questionId || !code || !output) {
    return res.status(400).json({ error: 'Question ID, code, and output are required' });
  }

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const newSubmission = new Submission({
      question: {
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
      },
      code,
      output,
    });

    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Error adding submission:', error);
    res.status(500).json({ error: 'Error adding submission' });
  }
});

// GET endpoint to fetch reviewed submissions
router.get('/reviewed', async (req, res) => {
  try {
    const reviewedSubmissions = await Submission.find({
      $or: [
        { marks: { $ne: null } }, // Marks are not null
        { comments: { $ne: '' } } // Comments are not empty
      ],
    });

    res.json(reviewedSubmissions);
  } catch (error) {
    console.error('Error fetching reviewed submissions:', error);
    res.status(500).json({ error: 'Error fetching reviewed submissions' });
  }
});

// GET endpoint to fetch all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Error fetching submissions' });
  }
});

// PUT endpoint to update marks and comments
router.put('/:id/marks', async (req, res) => {
  const { id } = req.params;
  const { marks, comments } = req.body;

  if (marks === undefined || comments === undefined) {
    return res.status(400).json({ error: 'Marks and comments are required' });
  }

  try {
    const submission = await Submission.findByIdAndUpdate(
      id,
      { marks, comments, reviewed: true },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error updating marks and comments:', error);
    res.status(500).json({ error: 'Error updating marks and comments' });
  }
});

// DELETE endpoint to delete a submission
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Error deleting submission' });
  }
});

module.exports = router;
