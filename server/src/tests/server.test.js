const { default: mongoose } = require("mongoose");
const request = require("supertest");
const app = require("../index");
const songs = require("./testData/songs")
const albums = require("./testData/albums")
const artists = require("./testData/artists")
const genres = require("./testData/genres")

//The default email can be our testing account: "statifytest@gmail.com".
const email = process.env.EMAIL;

//Settings for api calls
const offset = 0;
const limit = 5;

// Manually generate token then add to .env file
// Easy way is to click "Get Token" from this link: https://developer.spotify.com/console/get-current-user/
const token = process.env.TOKEN;

/* Testing Server Endpoints */

// Get top artists
test("Get Top Artists", async () => {
  await request(app)
    .get(`/api/artists/top?email=${email}&offset=${offset}&limit=${limit}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.success.length).toBeLessThanOrEqual(limit);
      // Loop through n items (limit). 
      // Checks that the returned key/value pairs are of the expected type 
      // Calls the server's get top artist endpoint and compares the results to our downloaded data.
      for (let i = 0; i < limit && i < response.body.success.length; i++) {
        expect(response.body.success[i]).toMatchObject({
          id: expect.any(String),
          rank: expect.any(String),
          mediaName: expect.any(String),
          image: expect.any(String)
        });
        expect(response.body.success[i]).toMatchObject({
          id: artists[i].id,
          rank: artists[i].rank,
          mediaName: artists[i].mediaName,
          image: artists[i].image
        });
      }

    });
});

// Get top albums
test("Get Top Albums", async () => {
  await request(app)
    .get(`/api/albums/top?email=${email}&offset=${offset}&limit=${limit}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.success.length).toBeLessThanOrEqual(limit);
      // Loop through n items (limit). 
      // Checks that the returned key/value pairs are of the expected type 
      // Calls the server's get top albums endpoint and compares the results to our downloaded data.
      for (let i = 0; i < limit && i < response.body.success.length; i++) {
        expect(response.body.success[i]).toMatchObject({
          id: expect.any(String),
          rank: expect.any(String),
          creators: expect.any(Array),
          mediaName: expect.any(String),
          image: expect.any(String)
        });
        expect(response.body.success[i]).toMatchObject({
          id: albums[i].id,
          rank: albums[i].rank,
          creators: albums[i].creators,
          mediaName: albums[i].mediaName,
          image: albums[i].image
        });
      }
    });
});

// Get top Songs
test("Get Top Songs", async () => {
  await request(app)
    .get(`/api/songs/top?email=${email}&offset=${offset}&limit=${limit}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.success.length).toBeLessThanOrEqual(limit);
      // Loop through n items (limit). 
      // Checks that the returned key/value pairs are of the expected type 
      // Calls the server's get top songs endpoint and compares the results to our downloaded data.
      for (let i = 0; i < limit && i < response.body.success.length; i++) {
        expect(response.body.success[i]).toMatchObject({
          id: expect.any(String),
          rank: expect.any(String),
          mediaName: expect.any(String),
          creators: expect.any(Array),
          image: expect.any(String)
        });
        expect(response.body.success[i]).toMatchObject({
          id: songs[i].id,
          rank: songs[i].rank,
          mediaName: songs[i].mediaName,
          creators: songs[i].creators,
          image: songs[i].image
        });
      }
    });
});

// Get top Genres
test("Get Top Genres", async () => {
  await request(app)
    .get(`/api/genres/top?email=${email}&offset=${offset}&limit=${limit}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.success.length).toBeLessThanOrEqual(limit);
      // Loop through n items (limit). 
      // Checks that the returned key/value pairs are of the expected type 
      // Calls the server's get top genre endpoint and compares the results to our downloaded data.
      for (let i = 0; i < limit && i < response.body.success.length; i++) {
        expect(response.body.success[i]).toMatchObject({
          rank: expect.any(String),
          mediaName: expect.any(String),
        });
        expect(response.body.success[i]).toMatchObject({
          rank: genres[i].rank,
          mediaName: genres[i].mediaName,
        });
      }
    });
});

// Get top recommendations
// Requires access token
test("Get Top Recommendations", async () => {
  await request(app)
    .get(`/api/recommendations/top?email=${email}&offset=${offset}&limit=${limit}&token=${token}`)
    .then(response => {
      expect(response.statusCode).toBe(200);
      expect(response.body.songs.length).toBeLessThanOrEqual(limit);
      for (let i = 0; i < limit && i < response.body.songs.length; i++) {
        expect(response.body.songs[i]).toMatchObject({
          songName: expect.any(String),
          albumName: expect.any(String),
          image: expect.any(String),
          artists: expect.any(Array)
        });
      }
    });
});


beforeEach((done) => {
  done()
});

// Close db connection after all tests are run
afterAll(async () => {
  await mongoose.connection.close()
});