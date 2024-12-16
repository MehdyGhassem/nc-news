const cors = require('cors');
const express = require('express');
const {getEndpoints, getTopics} = require('./controllers/topics.controller');
const {getArticleById, getArticles, patchArticleById} = require('./controllers/articles.controller');
const {getCommentsByArticleId, postCommentByArticleId} = require('./controllers/comments.controller')



app.use(cors());
app.use(express.json());
const app = express();

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticleById)


app.use('*', (req, res) => {
    res.status(404).send({ msg: 'Not Found' });
  });

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
      return res.status(err.status).send({ msg: err.msg });
    }
  
    if (err.code === '22P02') { 
      return res.status(400).send({ msg: 'Invalid article_id' });
    }
  
    if (err.code === '23503') { 
      return res.status(404).send({ msg: 'Article or user not found' });
    }
  
    res.status(500).send({ msg: 'Internal Server Error' });
  });





module.exports = app;

