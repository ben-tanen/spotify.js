var api = new SpotifyAPI();

function none() { }

api.login.setClientId('52c0de20baf34205a23827704f80c151');
api.login.setRedirect('http://localhost:8000/sample-app/');

playlists = [ ];
tracks    = [ ];
csvText   = '';

$(document).ready(function() {
    api.login.pullAccessToken(none, false);

    $('#login-btn').click(function() {
        scopes = [
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-read',
            'user-library-modify',
            'user-read-private',
            'user-read-birthdate',
            'user-read-email',
            'user-follow-read',
            'user-follow-modify',
            'user-top-read'
        ];
        api.login.openLogin(scopes);
    });

    $('#playlists-btn').click(function() {
        api.playlist.getUserPlaylists(none, 'got playlists');
    })

    $('#test-btn').click(function() {
        api.artist.getRelatedArtists('5INjqkS1o8h1imAzPqGZBb', none, 'got artists');
    });
});

function buildList(url, next, error, done) {
    $.ajax(url, {
        dataType: 'json',
        headers: {
            'Authorization': api.login.getAuthHeader()
        },
        success: function(data) {
            next(data);

            if (data['next']) {
                buildList(data['next'], next, error, done);
            } else {
                done();
            }
        },
        error: function(data) {
            error(data);
        }
    });
}