const articleController = require('../controllers/articleController')
const express = require('express')
const router = express.Router()


router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getArticleById);
router.post('/', articleController.createArticle);
router.patch('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.patch('/status/:id', articleController.updateStatus);
router.get('/createPage/:id', articleController.loadCreatePageWithArticle);

module.exports = router;

