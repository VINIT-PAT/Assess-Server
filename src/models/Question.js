// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  testCases: [Object]
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
