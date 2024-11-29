const db = require('../db/connection');

exports.fetchCommentsByArticleId = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: 'Bad Request' });
    }
    return db
        .query(
            `SELECT comment_id, votes, created_at, author, body, article_id
             FROM comments
             WHERE article_id = $1
             ORDER BY created_at DESC`,
            [article_id]
        )
        .then((result) => {
            if (result.rows.length > 0) {
              return result.rows;
            } else {
              return db
                .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
                .then((articleResult) => {
                  if (articleResult.rows.length === 0) {
                    return Promise.reject({ status: 404, msg: 'Article not found' });
                  }
                  return [];
                });
            }
          });
      };