        const Article = require('../models/article')

        // creates an article on the database
        exports.createArticle = async (req,res) =>{
        try{
            const { title, author, status, publish_date, blocks} = req.body;

            if(!title || !status || !publish_date || !blocks){
                return res.status(400).json({message: 'Missing required fields'});
            }
            
            const validStatuses = ['posted', 'unfinished', 'finished'];
            if(!validStatuses.includes(status)){
                return res.status(400).json({message: 'Invalid Status Value.'});
            }
            
            const newArticle = new Article({
                title,
                author,
                status,
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
        exports.deleteArticle = async (req, res) =>{
            const {title,creation_date} = req.body
            try{
                const match = await Article.findOneAndDelete({title,creation_date})

                if(!match){
                    return res.status(404).json({message: "Article not found!"});
                }

                return res.status(200).json({message: "Successfully deleted article!"});
            }catch (err){
                console.error("Error deleting article:", err);
                return res.status(500).json({message: "Server error while deleting article."});
            }
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
            try{
                const{id} = req.params;
                if(!id.match(/^[0-9a-fa-F]{24}$/)){
                return res.status(400).json({message: 'Invalid article ID'});
            }
            

            const article = await Article.findById(id);

            if(!article){
                return res.status(404).json({message: 'Article not found.'}); 
            }
            return res.status(200).json(article); 
        }catch(err){
            console.error('Error fetching article:', err);
            return res.status(500).json({message: 'Server error while fetching article.'})
        }

        }