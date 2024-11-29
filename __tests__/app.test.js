const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app"); 
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const db = require('../db/connection')

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
})



describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the article object for a valid article_id", () => {
      return request(app)
          .get("/api/articles/1")  
          .expect(200)
          .then(({ body: { article } }) => {
              expect(article).toHaveProperty('author');
              expect(article).toHaveProperty('title');
              expect(article).toHaveProperty('article_id');
              
              expect(article.article_id).toBe(1);
          });
  });
});


  test("404: Responds with an error message if the article_id is not found", () => {
    return request(app)
      .get("/api/articles/999") 
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
  test("400: Responds with an error message when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number") 
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article_id');
      });
  });


describe('GET /api/articles', () => {
  test("200: Responds with an array of articles with required properties", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });

      
  });
  test('status:400, responds with an error message when passed an invalid article_id', () => {
    return request(app)
      .get('/api/articles/notAnID')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article_id');
      });
  });

  test('status:404, responds with an error message when article_id does not exist', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
});


describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for a valid article_id", () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments).toBeInstanceOf(Array);
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1, 
          })
        );
      });
    });
});

  test("404: Responds with a 404 error if article_id does not exist", () => {
      return request(app)
          .get('/api/articles/999999/comments')  
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Article not found');
          });
  });

  test("200: Responds with an empty array if no comments exist for a valid article_id", () => {
      return request(app)
          .get('/api/articles/2/comments')  
          .expect(200)
          .then(({ body: { comments } }) => {
              expect(comments).toEqual([]);
          });
  });
  test("400: Responds with a 400 error for an invalid article_id", () => {
    return request(app)
      .get('/api/articles/notAnID/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('201: Responds with the posted comment', () => {
    const newComment = { username: 'butter_bridge', body: 'Great article!' };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            author: 'butter_bridge',
            body: 'Great article!',
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  

  test('400: Responds with error for missing fields', () => {
    const newComment = { username: 'butter_bridge' }; 

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Missing required fields: username or body');
      });
  });

  test('404: Responds with error if article_id does not exist', () => {
    const newComment = { username: 'mehdy_ghassemi', body: 'Nice!' };

    return request(app)
      .post('/api/articles/999999/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article or user not found');
      });
  });

  test('400: Responds with error for invalid article_id', () => {
    const newComment = { username: 'mehdy_ghassem', body: 'Nice!' };

    return request(app)
      .post('/api/articles/notAnID/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article_id');
      });
  });

  test('404: Responds with error if username does not exist', () => {
    const newComment = { username: 'nonexistent_user', body: 'Nice!' };

    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article or user not found');
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Successfully updates the votes of a valid article", () => {
      return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { article } }) => {
              expect(article).toHaveProperty('article_id', 1);
              expect(article).toHaveProperty('votes', expect.any(Number));  
          });
  });

  test("400: Responds with an error when inc_votes is not provided", () => {
      return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Missing inc_votes');
          });
  });

  test("400: Responds with an error when inc_votes is not a valid number", () => {
      return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: "invalid" })
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Invalid value for votes');
          });
  });

  test("404: Responds with an error when article_id does not exist", () => {
      return request(app)
          .patch('/api/articles/999999')
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Article not found');
          });
  });
});
