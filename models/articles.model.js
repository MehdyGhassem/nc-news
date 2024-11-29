const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
    return db
        .query(
            `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
             FROM articles
             WHERE article_id = $1`,
            [article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            } else {
                return db.query(
                    `SELECT * FROM comments WHERE article_id = $1`,
                    [article_id]
                )
                .then((commentResult) => {
                    const article = result.rows[0];
                    article.comment_count = commentResult.rows.length; 
                    article.comments = commentResult.rows; 
                    return article;
                });
            }
        });
};


exports.fetchArticles = () => {
    return db.query(
        `SELECT 
            articles.author, 
            articles.title, 
            articles.article_id, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COALESCE(COUNT(comments.comment_id), 0) AS comment_count
         FROM articles
         LEFT JOIN comments ON articles.article_id = comments.article_id
         GROUP BY articles.article_id
         ORDER BY articles.created_at DESC;`
    ).then((result) => {
        return result.rows.map((article) => {
            article.comment_count = Number(article.comment_count);
            return article;
        });
    });
};


exports.updateVotesByArticleId = (article_id, inc_votes) => {
    if (isNaN(inc_votes)) {
        return Promise.reject({ status: 400, msg: 'Invalid value for votes' });
    }

    return db
        .query(
            `UPDATE articles 
             SET votes = votes + $1 
             WHERE article_id = $2
             RETURNING *;`,
            [inc_votes, article_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return result.rows[0]; 
        });
};