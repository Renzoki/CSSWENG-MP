const Article = require('../models/article')

//TODO: creates an article on the database, for drafts page
exports.createArticle = async (req,res) =>{
   try{
    const { title, author, status, publish_date, blocks} = req.body;

    if(!title || !status || !publish_Date || !blocks){
        return res.status(400).json({message: 'Missing required fields'});
    }
    
    const validStatuses = ['posted', 'unfinished', 'finished'];
    if(!validStatuses.includes(status)){
        return res.status(400).json({message: 'Invalid Status Value.'});
    }
    
    const newArticle = new Article({
        title,
        author,
        publish_date,
        blocks
    });

    const savedArticle = await newArticle.save();
    return res.status(201).json(savedArticle);
   } catch(err){
    console.error('Error creating article:', err);
    return res.status(500).json({message: 'Server error while creating article.'});
   } 
};

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
    return res.status(404)
}

//TODO: get the content of a specific article, for uploading/editing
exports.getArticleById = async (req,res) =>{
    return res.status(404)
}