const Article = require('../models/article')
const mongoose = require('mongoose');

// creates an article on the database
exports.createArticle = async (req, res) => {
  try {
    const { title, author, status, publish_date, blocks } = req.body;

    if (!title || !status || !blocks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validStatuses = ['published', 'unfinished', 'finished','archived'];
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
  const { status, publish_date } = req.body;

  const validStatuses = ["finished", "unfinished", "published", "archived"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

 
  const update = { status };

  if (status === "published") {
    update.publish_date = publish_date || new Date(); 
  }

  try {
    const updated = await Article.findByIdAndUpdate(
      id,
      update, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Article not found." });
    }

    return res.status(200).json({
      message: `Status updated to '${status}'.`,
      article: updated
    });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Server error while updating status." });
  }
};


exports.loadCreatePageWithArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await Article.findById(id);
        if (!article) return res.status(404).send("Article not found");

        res.render('admin/createArticle', { article: JSON.stringify(article) }); // serialized into JS
    } catch (err) {
        console.error("Error loading article:", err);
        res.status(500).send("Server error");
    }
};

exports.saveDraft = async (req, res) => {
  const { _id, title, author, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Missing title or content" });
  }

  try {
    if (_id) {
      const updated = await Article.findByIdAndUpdate(
        _id,
        {
          title,
          author,
          blocks: content
        },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: "Article not found" });
      }

      return res.json({ success: true, message: "Draft updated", article: updated });
    } else {
      const newArticle = new Article({
        title,
        author,
        blocks: content,
        publish_date: null
      });

      await newArticle.save();
      return res.status(201).json({ success: true, message: "Draft created", article: newArticle });
    }
  } catch (err) {
    console.error("Error saving draft:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  

};


