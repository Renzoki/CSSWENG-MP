const express = require('express');
const router = express.Router();
const Article = require('../models/article'); // Adjust path if necessary
const Inquiry = require('../models/inquiry'); // <-- Add this

// 1. Get all articles with title, author, first text block, and first image filename
router.get('/getArticleList', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' }, 'title author blocks publish_date').sort({ publish_date: -1 }).lean();

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

router.get('/getRecentArticles', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ publish_date: -1 })
      .limit(6)
      .lean();

    res.json(articles);
  } catch (err) {
    console.error('Error fetching recent articles:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;