var spotify = new SpotifyAPI();

function none() { }

spotify.login.setClientId('52c0de20baf34205a23827704f80c151');
spotify.login.setRedirect('http://localhost:8000/sample-app/');

playlists = [ ];
tracks    = [ ];
csvText   = '';

$(document).ready(function() {
    spotify.login.pullAccessToken(none, false);

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
        spotify.login.openLogin(scopes);
    });

    $('#playlists-btn').click(function() {
        spotify.playlist.getUserPlaylists(none, 'got playlists');
    })

    $('#test-btn').click(function() {
        spotify.follow.checkUsersFollowPlaylist('129874447', '08w7Z0Hu7kVxEdnHAiFCnI', ['cgioffre'], none, 'got releases');
    });
});

function buildList(url, next, error, done) {
    $.ajax(url, {
        dataType: 'json',
        headers: {
            'Authorization': spotify.login.getAuthHeader()
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