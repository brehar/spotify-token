'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var SpotifyWebApi = require('spotify-web-api-node');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};

app.use(morgan('dev'));
app.use(allowCrossDomain);

var clientId = 'b52dc91988324fd697d1f2db77378d46',
    clientSecret = process.env.SPOTIFY_SECRET;

var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

var spotifyToken;

spotifyApi.clientCredentialsGrant().then(function (data) {
    spotifyToken = data.body['access_token'];
}, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get('/', (req, res) => {
    res.send(spotifyToken);
});

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});