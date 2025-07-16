const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/articles', articleRoutes);

// Connect to MongoDB Atlas
mongoose.connect('mongodb://127.0.0.1:27017/littleflowers_test')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(3000, () => {
      console.log('🚀 Server running at http://localhost:3000');
    });
  })
  .catch(err => console.error(err));