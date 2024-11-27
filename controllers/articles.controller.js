const { fetchArticleById, fetchArticles } = require('../models/articles.model');


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            if (err.code === '22P02') {  
                res.status(400).send({ msg: 'Invalid article_id' });
            } else {
                next(err); 
            }
        });
};

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};
