const articleController = require('../controllers/articleController')
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/', authController.isAuthenticated, articleController.getAllArticles);
router.get('/:id', authController.isAuthenticated, articleController.getArticleById);
router.post('/', authController.isAuthenticated, articleController.createArticle);
router.patch('/:id', authController.isAuthenticated, articleController.updateArticle);
router.delete('/:id', authController.isAuthenticated, articleController.deleteArticle);
router.patch('/status/:id', authController.isAuthenticated, articleController.updateStatus);
router.post('/saveDraft', authController.isAuthenticated, articleController.saveDraft);
router.get('/editArticle/:id', authController.isAuthenticated, articleController.loadCreatePageWithArticle);

module.exports = router;

