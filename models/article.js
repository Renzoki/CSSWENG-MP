const mongoose = require('mongoose');

const blockSchema  = new mongoose.Schema({
  type: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true }
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  status: { type: String, required: true, enum: ['posted','unfinished','finished'] },
  creation_date: { type: Date, default: Date.now, required: true },
  publish_date: { type: Date, default: null },
  blocks: [blockSchema]
});

module.exports = mongoose.model('Article', articleSchema, 'articles');
