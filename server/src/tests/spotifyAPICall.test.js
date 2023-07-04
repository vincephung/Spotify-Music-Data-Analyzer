const { default: mongoose } = require("mongoose");
const request = require("supertest");

// Manually generate token then add to .env file
// Easy way is to click "Get Token" from this link: https://developer.spotify.com/console/get-current-user/
const token = process.env.TOKEN;

//settings for api calls
const offset = 0;
const limit = 5;

// ID for get artist
const artistID = '1Xyo4u8uXC1ZmMpatF05PJ';

// Data for song recommendations
const artists = ['4NHQUGzhtTLFvgF5SZesLK'];
const genres = ['classical', 'country'];
const tracks = ['0c6xIDDpzE81m2q797ordA'];

/* Testing Spotify API Endpoints */
// Get top artists
test("Get Top Artists", async () => {
  const response = await request('https://api.spotify.com')
    .get(`/v1/me/top/artists?time_range=long_term&limit=${limit}&offset=${offset}`)
    .set('Authorization', `Bearer ${token}`)
    .set(`Content-Type`, `application/json`)

  expect(response.statusCode).toBe(200);
  expect(response._body.items.length).toBeLessThanOrEqual(limit);
  expect(response._body.href).toBeDefined();
  expect(response._body.items).toBeDefined();
  expect(response._body.limit).toBeDefined();
  expect(response._body.next).toBeDefined();
  expect(response._body.offset).toBeDefined();
  expect(response._body.previous).toBeDefined();
  expect(response._body.total).toBeDefined();
});

// Get top songs
test("Get Top Songs", async () => {
  const response = await request('https://api.spotify.com')
    .get(`/v1/me/top/tracks?time_range=long_term&limit=${limit}&offset=${offset}`)
    .set('Authorization', `Bearer ${token}`)
    .set(`Content-Type`, `application/json`)

  expect(response.statusCode).toBe(200);
  expect(response._body.items.length).toBeLessThanOrEqual(limit);
  expect(response._body.href).toBeDefined();
  expect(response._body.items).toBeDefined();
  expect(response._body.limit).toBeDefined();
  expect(response._body.next).toBeDefined();
  expect(response._body.offset).toBeDefined();
  expect(response._body.previous).toBeDefined();
  expect(response._body.total).toBeDefined();
});

// Get artist data
test("Get Artist Data", async () => {
  const response = await request('https://api.spotify.com')
    .get(`/v1/artists/${artistID}`)
    .set('Authorization', `Bearer ${token}`)
    .set(`Content-Type`, `application/json`)

  expect(response.statusCode).toBe(200);
  expect(response._body.href).toBeDefined();
  expect(response._body.external_urls).toBeDefined();
  expect(response._body.followers).toBeDefined();
  expect(response._body.genres).toBeDefined();
  expect(response._body.id).toBeDefined();
  expect(response._body.images).toBeDefined();
  expect(response._body.name).toBeDefined();
  expect(response._body.popularity).toBeDefined();
  expect(response._body.type).toBeDefined();
  expect(response._body.uri).toBeDefined();
});

// Get user data 
test("Get user's data", async () => {
  const response = await request('https://api.spotify.com')
    .get(`/v1/me`)
    .set('Authorization', `Bearer ${token}`)
    .set(`Content-Type`, `application/json`)

  expect(response.statusCode).toBe(200);
  expect(response._body.country).toBeDefined();
  expect(response._body.display_name).toBeDefined();
  expect(response._body.email).toBeDefined();
  expect(response._body.explicit_content).toBeDefined();
  expect(response._body.external_urls).toBeDefined();
  expect(response._body.followers).toBeDefined();
  expect(response._body.href).toBeDefined();
  expect(response._body.id).toBeDefined();
  expect(response._body.images).toBeDefined();
  expect(response._body.product).toBeDefined();
  expect(response._body.type).toBeDefined();
  expect(response._body.uri).toBeDefined();
});

// Get song recommendations
test("Get song recommendations", async () => {
  const response = await request('https://api.spotify.com')
    .get(`/v1/recommendations?limit=${limit}&seed_artists=${artists}&seed_genres=${genres}&seed_tracks=${tracks}`)
    .set('Authorization', `Bearer ${token}`)
    .set(`Content-Type`, `application/json`)

  expect(response.statusCode).toBe(200);
  expect(response._body.seeds).toBeDefined();
  expect(response._body.tracks).toBeDefined();
});

beforeEach((done) => {
  done()
});

// Close db connection after all tests are run
afterAll(async () => {
  await mongoose.connection.close()
});