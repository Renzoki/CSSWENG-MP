const Article = require('../models/article')

//TODO: creates an article on the database, for drafts page
exports.createArticle = async (req,res) =>{
    return res.status(404)
}

//TODO: update article on the db, 
exports.updateArticle = async (req,res) =>{
    return res.status(404)
}

//TODO: delete article
exports.deleteArticle = async (req, res) =>{
    return res.status(404)
}

//TODO: returns all articles, this would be for the drafts function
exports.getAllArticles = async (req,res) =>{
    try{
        const articles =  await Article.find();
        res.status(200).json(articles);
    }catch (err){
        console.error(err);
        res.status(500)
    }
}

//TODO: get the content of a specific article, for uploading/editing
exports.getArticleById = async (req,res) =>{
    return res.status(404)
}