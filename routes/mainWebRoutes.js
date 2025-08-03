const express = require('express');
const router = express.Router();
const Article = require('../models/article'); // Adjust path if necessary
const Inquiry = require('../models/inquiry'); // <-- Add this

// 1. Get all articles with title, author, first text block, and first image filename
router.get('/getArticleList', async (req, res) => {
  try {
    const articles = await Article.find({}, 'title author blocks publish_date').lean();

    const result = articles.map(article => {
      const firstTextBlock = article.blocks.find(block => block.type === 'text');
      const firstImageBlock = article.blocks.find(block => block.type === 'image');

      return {
        _id: article._id,
        title: article.title,
        author: article.author,
        firstTextData: firstTextBlock ? firstTextBlock.data : null,
        firstImageFilename: firstImageBlock ? firstImageBlock.data : null,
        publish_date: article.publish_date
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching article summaries:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Get one article by ID, excluding "status" and "creation_date"
router.get('/ArticlePage/:id', async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId, { status: 0, creation_date: 0 }).lean();

    if (!article) {
      return res.status(404).render('404'); // You can also change this to Main/404 if your 404 is in templates/Main/
    }

    article.blocks.sort((a, b) => a.order - b.order);

    res.render('Main/ArticlePage', { article }); // <- This is the fix
  } catch (err) {
    console.error('Error rendering article page:', err);
    res.status(500).send('Server error');
  }
});

// POST /mainWeb/inquiry - Save a user inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const { name, email, contactNumber, inquiry } = req.body;

    // Basic validation
    if (!name || !email || !inquiry) {
      return res.status(400).json({ error: 'Name, email, and inquiry are required' });
    }

    const newInquiry = new Inquiry({
      name,
      email,
      contactNumber,
      inquiry
    });

    await newInquiry.save();

    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (err) {
    console.error('Error saving inquiry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;