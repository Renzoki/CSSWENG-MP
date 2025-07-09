const articleController = require('../controllers/articleController')
const express = require('express')
const router = express.Router()

router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getArticleById);


module.exports = router;

