const express = require('express');
const app = express();
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste here your credentials
const clientId = '1c30624cba6742dcb792991caecae571',
    clientSecret = '746977b1e77240faa9d0d2411c3e0efe';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});


app.get('/', (req, res, next) => {
  res.render('views/index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artistInput)
    .then(data => {
      res.render();
    })
    .catch(err => {
      next(err);
    });
});


app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums('req.params.artistId')
  .then((data) => {
    res.render('views/albums', data.body);
  })
  .catch((err) => {
    next(err);
  });
});
