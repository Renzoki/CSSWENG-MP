const Article = require('../models/article')

// creates an article on the database
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

// update article on the db 
exports.updateArticle = async (req,res) =>{
    try{
        const { id } = req.params;
        const updateData = req.body;

        if(updateData.status){
            const validStatuses = ['posted', 'unfinished', 'finished'];
             if(!validStatuses.includes(status)){
                return res.status(400).json({message: 'Invalid Status Value.'});
            }
        }
    

    const updateArticle = await Article.findByIdandUpdate(
        id,
        {$set: updateData},
        {new: true, runValidators: true}
    );

    if (!updateArticle){
        return res.status(404).json({message: 'Article not found.'});
    }

    return res.status(200).json(updateArticle);
    } catch(err){
        console.error('Error updating Articles:', err);
        return res.status(500).json({message: 'Server error while updating article.'});
    }

}

//TODO: delete article
exports.deleteArticle = async (req, res) =>{
    return res.status(404)
}

//returns all articles
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