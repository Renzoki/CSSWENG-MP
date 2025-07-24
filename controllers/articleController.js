const Article = require('../models/article')
const mongoose = require('mongoose');

// creates an article on the database
exports.createArticle = async (req, res) => {
  try {
    const { title, author, status, publish_date, blocks } = req.body;

    if (!title || !status || !blocks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validStatuses = ['posted', 'unfinished', 'finished','archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid Status Value.' });
    }

    const newArticle = new Article({
      title,
      author,
      status,
      publish_date: publish_date || null,
      blocks
    });

    const savedArticle = await newArticle.save();
    return res.status(201).json(savedArticle);

  } catch (err) {
    console.error('Error creating article:', err);
    return res.status(500).json({ message: 'Server error while creating article.' });
  }
};

// update article on the db 
exports.updateArticle = async (req,res) =>{
    try{
        const { id } = req.params;
        const updateData = req.body;

        if(updateData.status){
            const validStatuses = ['posted', 'unfinished', 'finished','archived'];
            if(!validStatuses.includes(updateData.status)){
                return res.status(400).json({message: 'Invalid Status Value.'});
            }
        }
    

    const updateArticle = await Article.findByIdAndUpdate(
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

//deletes article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid article ID." });
  }

  try {
    const match = await Article.findByIdAndDelete(id);

    if (!match) {
      return res.status(404).json({ message: "Article not found!" });
    }

    return res.status(200).json({ message: "Successfully deleted article!" });
  } catch (err) {
    console.error("Error deleting article:", err);
    return res.status(500).json({ message: "Server error while deleting article." });
  }
};


//returns all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Server error while fetching articles." });
  }
};

//get the content of a specific article, for uploading/editing

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid article ID' });
    }

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    return res.status(200).json(article);

  } catch (err) {
    console.error('Error fetching article:', err);
    return res.status(500).json({ message: 'Server error while fetching article.' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["finished", "unfinished", "published", "archived"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const updated = await Article.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article not found." });
    }

    return res.status(200).json({ message: `Status updated to '${status}'.`, article: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Server error while updating status." });
  }
};
