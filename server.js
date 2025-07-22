const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/articles', articleRoutes);

mongoose.connect('mongodb+srv://admin1234:waxdQSCrfv135@littleflowers.e5ux44c.mongodb.net/littleflowers?retryWrites=true&w=majority&appName=LittleFlowers')
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(3000, () => {
      console.log('🚀 Server running at http://localhost:3000');
    });
  })
  .catch(err => console.error(err));