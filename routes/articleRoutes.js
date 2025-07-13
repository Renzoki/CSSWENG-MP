const articleController = require('../controllers/articleController')
const express = require('express')
const router = express.Router()


router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getArticleById);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/delete',articleController.deleteArticle);


module.exports = router;

