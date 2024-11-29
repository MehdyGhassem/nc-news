const express = require('express');
const {getEndpoints, getTopics} = require('./controllers/topics.controller');
const {getArticleById, getArticles} = require('./controllers/articles.controller');
const {getCommentsByArticleId} = require('./controllers/comments.controller')

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use('*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
  });

  app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
    next(err); 
  });
  
  app.use((err, req, res, next) => {
    if (err.code === '22P02') { 
      return res.status(400).send({ msg: 'Invalid article_id' });
    }
    next(err); 
  });

  
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});



module.exports = app;

