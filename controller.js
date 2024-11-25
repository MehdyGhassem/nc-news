const endpoints = require('./endpoints.json')
const topicsData = require('./db/data/development-data/topics')

const getEndpoints = (req, res) => {
    res.status(200).send({ endpoints });
  };
  
const getTopics = (req, res) => {
    res.status(200).send({ topics: topicsData });
  };

module.exports = {getEndpoints, getTopics}