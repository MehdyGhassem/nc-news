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
});
