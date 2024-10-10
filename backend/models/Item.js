const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['youtube', 'reddit'],
    required: true
  },
  author: String,
  subreddit: String,
  score: Number,
  num_comments: Number,
  created_utc: Number,
  description: String,
  publishedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);
