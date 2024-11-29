const { fetchArticleById, fetchArticles, updateVotesByArticleId } = require('../models/articles.model');


exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
      return res.status(400).send({ msg: 'Missing inc_votes' });
  }

  updateVotesByArticleId(article_id, inc_votes)
      .then((updatedArticle) => {
          res.status(200).send({ article: updatedArticle });
      })
      .catch(next);
};