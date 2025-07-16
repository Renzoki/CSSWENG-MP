const articleController = require('../controllers/articleController')
const express = require('express')
const router = express.Router()


router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getArticleById);
router.post('/', articleController.createArticle);
router.patch('/:id', articleController.updateArticle);s
router.delete('/:id', articleController.deleteArticle);


module.exports = router;

