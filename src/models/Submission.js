const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  question: {
    title: String,
    description: String,
    difficulty: String,
  },
  code: String,
  output: String,
  marks: Number,
  comments: String,
  createdAt: { type: Date, default: Date.now },
  reviewed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Submission', submissionSchema);
