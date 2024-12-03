const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Submission = require('../models/Submission');

// Add a new submission
router.post('/', async (req, res) => {
  const { questionId, code, output } = req.body;

  if (!questionId || !code || !output) {
    return res.status(400).json({ error: 'Question ID, code, and output are required' });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

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
router.get('/reviewed', async (req, res) => {
  try {
    // Find submissions that are reviewed (marks assigned or comments present)
    const reviewedSubmissions = await Submission.find({
      $or: [
        { marks: { $ne: null } }, // Marks are not null
        { comments: { $ne: '' } } // Comments are not empty
      ]
    });

    res.json(reviewedSubmissions);
  } catch (error) {
    console.error('Error fetching reviewed submissions:', error);
    res.status(500).json({ error: 'Error fetching reviewed submissions' });
  }
});

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching submissions' });
  }
});

// Update marks and comments
router.put('/:id/marks', async (req, res) => {
  const { id } = req.params;
  const { marks, comments } = req.body;

  try {
    const submission = await Submission.findByIdAndUpdate(
      id,
      { marks, comments, reviewed: true },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Error updating marks and comments' });
  }
});

// Delete a submission
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.status(200).json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting submission' });
  }
});

module.exports = router;
