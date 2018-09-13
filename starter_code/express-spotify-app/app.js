const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

require("dotenv").config();
// Remember to paste here your credentials
const clientId = process.env.SPOTIFY_ID,
    clientSecret = process.env.SPOTIFY_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch((err) => {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistInput)
    .then(result => {
      console.log(result.body.artists.items);
      res.render('artists', {data: result.body.artists.items});
    })
    .catch(err => {
      next(err);
    });
});


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then((result) => {
    console.log("the albums info ==================== ", result.body.items);
    res.render('albums', {data: result.body.items});
  })
  .catch((err) => {
    next(err);
  });
});


app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then((result) => {
    console.log("track info ------------------------ ", result.body.items[0]);
    res.render('tracks', {data: result.body.items});
  })
  .catch((err) => {
    next(err);
  });
});


app.listen(3000);

module.exports = app;
