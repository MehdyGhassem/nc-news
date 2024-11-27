const { fetchArticleById } = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    if (isNaN(article_id)) {
        return res.status(400).send({ msg: 'Invalid article_id' });
    }

    fetchArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next); 
};
