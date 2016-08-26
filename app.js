var api = new SpotifyAPI();

function none() { }

api.login.setClientId('52c0de20baf34205a23827704f80c151');
api.login.setRedirect('http://localhost:8000/');

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
});

function test() {
    // api.Track.getTrackAudioFeatures('0rl5DA937m7eHFCMt2Wdxe', none, true)
    // api.Playlists.getPlaylist('129874447', '1AbmWHLKFGhdhR6KYgZclO', none, true);
    api.general.getURL('https://api.spotify.com/v1/users/129874447/playlists/1AbmWHLKFGhdhR6KYgZclO/tracks?offset=60&limit=20', none, true);
}

function parseTrackToCSV(track) {
    added_at   = track['added_at'];
    name       = track['track']['name'];
    album      = track['track']['album']['name'];
    popularity = track['track']['popularity'];

    artists    = '';
    for (var i = 0; i < track['track']['artists'].length; i++) {
        artists += track['track']['artists'][i]['name'] + ',';
    }

    r = added_at + ',' + name + ',' + popularity + ',' + album + ',' + artists;
    return r.substr(0,r.length - 1);
}

function pullPlaylists() {
    pullAccessToken();

    var url = getUserPlaylistsURL();

    buildList(url,
        function(data) {
            playlists = $.merge(playlists, data['items']);
        },
        function(data) {
            console.log('error', data);
        },
        function() {
            for (var i = 0; i < playlists.length; i++) {
                console.log(playlists[i]['name']);
            }
        }
    );
}

function getUserPlaylistsURL() {
    var username = api.login.getUsername();
    if (username) {
        return 'https://api.spotify.com/v1/users/' + username + '/playlists';
    } else {
        return '';
    }
}

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

function doLogin() {
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&scope=playlist-read-private%20playlist-read-collaborative%20user-library-read' +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
    var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
}

function doSearch(word, user_id, callback) {
    console.log('search for ' + word);
    var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists/';
    var url = 'https://api.spotify.com/v1/users/129874447/playlists';
    $.ajax(url, {
        dataType: 'json',
        success: function(r) {
            console.log('got result:', r);
            // callback({
            //     word: word,
            //     tracks: r.tracks.items
            //         .map(function(item) {
            //             var ret = {
            //                 name: item.name,
            //                 artist: 'Unknown',
            //                 artist_uri: '',
            //                 album: item.album.name,
            //                 album_uri: item.album.uri,
            //                 cover_url: '',
            //                 uri: item.uri
            //             }
            //             if (item.artists.length > 0) {
            //                 ret.artist = item.artists[0].name;
            //                 ret.artist_uri = item.artists[0].uri;
            //             }
            //             if (item.album.images.length > 0) {
            //                 ret.cover_url = item.album.images[item.album.images.length - 1].url;
            //             }
            //             return ret;
            //         })
            // });
        },
        error: function(r) {
            console.log('got error:', r)
        }
    });
}