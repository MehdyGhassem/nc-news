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
        expect(article).toHaveProperty('body');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
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
});


