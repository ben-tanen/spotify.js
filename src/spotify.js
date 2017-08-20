(function(exports) {

    /*
    Spotify General API:
        getSelfInfo(callback, message)
        getUserInfo(user_id, callback, message)
    */
    var general = function(login) {
        this.login = login;
    }

    general.prototype.getUserInfo = function(user_id, callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id);
        this.getURL(url, callback, message);
    }

    general.prototype.getURL = function(url, callback, message) {
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (message) console.log(message + ":", r);
                callback(r);
            },
            error: function(r) {
                console.log('error:', r);
            }
        });
    }

    general.prototype.postURL = function(url, callback, message) {
        $.ajax(url, {
            method: 'POST',
            headers: {
                'Authorization': spotify.login.getAuthHeader()
            },
            success: function(r) {
                if (message) console.log(message + ":", r);
                callback(r);
            },
            error: function(r) {
                console.log('error:', r);
            }
        });
    }

    /*
    Spotify Login API:
        getAccessToken()
        setAccessToken(access_token)
        getUsername()
        setUsername(username)
        getClientId()
        setClientId(client_id)
        getRedirect()
        setRedirect(redirect)
        getLoginURL(scopes, state)
        openLogin(scopes, oldstate)
        getAuthHeader()
        getUserInfo(callback)
    */
    var login = function() {
        this.client_id = '';
        this.access_token = '';
        this.redirect = '';
    }

    login.prototype.pullAccessToken = function(callback, loud) {
        var hash = location.hash.replace(/#/g, '');
        var api  = this;

        if (hash.match('access_token=.*')) {
            if (loud) console.log('pulling access token...');
            var all = hash.split('&');
            all.forEach(function(keyvalue) {
                var idx = keyvalue.indexOf('=');
                var key = keyvalue.substring(0, idx);
                var val = keyvalue.substring(idx + 1);
                if (key == 'access_token') {
                    api.setAccessToken(val);
                    api.getUserInfo(function(userinfo) {
                        api.setUsername(userinfo.id);
                    });
                }
            });
            return true;
        } else {
            if (loud) console.log('no access token to pull...');
            return false;
        }
    }

    login.prototype.getAccessToken = function() {
        return localStorage.getItem('access_token') || '';
    }

    login.prototype.setAccessToken = function(access_token) {
        localStorage.setItem('access_token', access_token);
    }

    login.prototype.getUsername = function() {
        return localStorage.getItem('username') || '';
    }

    login.prototype.setUsername = function(username) {
        localStorage.setItem('username', username);
    }

    login.prototype.getClientId = function() {
        return this.client_id;
    }

    login.prototype.setClientId = function(client_id) {
        this.client_id = client_id;
    }

    login.prototype.getRedirect = function() {
        return this.redirect;
    }

    login.prototype.setRedirect = function(redirect) {
        this.redirect = redirect;
    }

    login.prototype.getLoginURL = function(scopes, state) {
        return 'https://accounts.spotify.com/authorize?client_id=' + this.client_id
            + '&redirect_uri=' + encodeURIComponent(this.redirect)
            + '&scope=' + encodeURIComponent(scopes.join(' '))
            + '&response_type=token';
    }

    login.prototype.openLogin = function(scopes, oldstate) {
        var url = this.getLoginURL(scopes, oldstate);
        location = url;
        // window.open(url);
    }

    login.prototype.getAuthHeader = function() {
        return 'Bearer ' + this.getAccessToken();
    }

    login.prototype.getUserInfo = function(callback, message) {
        var url = 'https://api.spotify.com/v1/me';
        $.ajax(url, {
            dataType: 'json',
            headers: {
                 'Authorization': this.getAuthHeader()
            },
            success: function(r) {
                if (message) console.log(message + ':', r);
                callback(r);
            }
        });
    }

    /*
    Spotify Search API:
        searchTracks(query, callback, loud)
    */
    var search = function(general) {
        this.general = general;
    }

    search.prototype.searchTracks = function(query, callback, message) {
        var url = 'https://api.spotify.com/v1/search?type=track&q='+encodeURIComponent(query);
        this.general.getURL(url, callback, message);
    }

    /*
    Spotify Track API:
        getTrack(track_id, callback, loud)
        getTracks(track_ids, callback, loud)
        getTrackAudioFeatures(track_id, callback, loud)
        getTracksAudioFeatures(track_ids, callback, loud)
    */
    var track = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    // get info for a track
    track.prototype.getTrack = function(track_id, callback, message) {
        var url = 'https://api.spotify.com/v1/tracks/'+encodeURIComponent(track_id);
        this.general.getURL(url, callback, message);
    }

    // get info for multiple tracks
    track.prototype.getTracks = function(track_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/tracks?ids='+encodeURIComponent(track_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    // get audio features for a track
    track.prototype.getAudioFeatures = function(track_id, callback, message) {
        var url = 'https://api.spotify.com/v1/audio-features/'+encodeURIComponent(track_id);
        this.general.getURL(url, callback, message);
    }

    // get audio features for multiple tracks
    track.prototype.getMultipleAudioFeatures = function(track_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/audio-features?ids='+encodeURIComponent(track_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    // get audio analysis for a track
    track.prototype.getAudioAnalysis = function(track_id, callback, message) {
        var url = 'https://api.spotify.com/v1/audio-analysis/'+encodeURIComponent(track_id);
        this.general.getURL(url, callback, message);
    }

    track.prototype.getUserTopTracks = function(callback, message) {
        var url = 'https://api.spotify.com/v1/me/top/tracks?limit=50';
        this.general.getURL(url, callback, message);
    }

    var album = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    album.prototype.getAlbum = function(album_id, callback, message) {
        var url = 'https://api.spotify.com/v1/albums/' + encodeURIComponent(album_id);
        this.general.getURL(url, callback, message);
    }

    album.prototype.getAlbums = function(album_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/albums?ids=' + encodeURIComponent(album_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    var artist = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    artist.prototype.getArtist = function(artist_id, callback, message) {
        var url = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(artist_id);
        this.general.getURL(url, callback, message);
    }

    artist.prototype.getArtists = function(artist_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/artists?ids=' + encodeURIComponent(artist_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    artist.prototype.getAlbums = function(artist_id, callback, message) {
        var url = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(artist_id) + '/albums';
        this.general.getURL(url, callback, message);
    }

    artist.prototype.getTopTracks = function(artist_id, country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(artist_id) + '/top-tracks?country=' + encodeURIComponent(country_id);
        this.general.getURL(url, callback, message);
    }

    artist.prototype.getRelatedArtists = function(artist_id, callback, message) {
        var url = 'https://api.spotify.com/v1/artists/' + encodeURIComponent(artist_id) + '/related-artists';
        this.general.getURL(url, callback, message);
    }

    artist.prototype.getUserTopArtists = function(callback, message) {
        var url = 'https://api.spotify.com/v1/me/top/artists?limit=50';
        this.general.getURL(url, callback, message);
    }

    /*
    Spotify Playlist API:
        getUserPlaylists(callback, loud)
        getPlaylists(user_id, callback, loud)
        getPlaylist(user_id, playlist_id, loud)
    */
    var playlist = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    // get list of user's playlists
    playlist.prototype.getUserPlaylists = function(callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(this.login.getUsername()) + '/playlists';
        this.general.getURL(url, callback, message);
    }

    // get list of playlist from a particular user
    playlist.prototype.getPlaylists = function(user_id, callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists';
        this.general.getURL(url, callback, message);
    }

    // get a playlist from a particular user
    playlist.prototype.getPlaylist = function(user_id, playlist_id, callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists/' + encodeURIComponent(playlist_id);
        this.general.getURL(url, callback, message);
    }

    playlist.prototype.addTracks = function(user_id, playlist_id, uris, callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists/' + encodeURIComponent(playlist_id) + '/tracks?uris=' + encodeURIComponent(uris.join(','));
        this.general.postURL(url, callback, message);
    }

    // TO DO:
    // - create playlist
    // - delete playlist
    // - add track to playlist
    // - remove track from playlist
    // - order or replace playlist tracks
    // - change playlist details

    var library = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    library.prototype.getTracks = function(country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/me/tracks?market=' + encodeURIComponent(country_id) + '&limit=50&offset=0';
        this.general.getURL(url, callback, message);
    }

    library.prototype.checkTracks = function(track_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/me/tracks/contains?ids=' + encodeURIComponent(track_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    var browse = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    browse.prototype.getNewReleases = function(country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/browse/new-releases?country=' + encodeURIComponent(country_id) + '&limit=50';
        this.general.getURL(url, callback, message);
    }

    browse.prototype.getFeaturedPlaylists = function(country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/browse/featured-playlists?country=' + encodeURIComponent(country_id) + '&limit=50';
        this.general.getURL(url, callback, message);
    }

    browse.prototype.getBrowseCategories = function(country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/browse/categories?country=' + encodeURIComponent(country_id) + '&limit=50';
        this.general.getURL(url, callback, message);
    }

    browse.prototype.getCategoryPlaylists = function(category_id, country_id, callback, message) {
        var url = 'https://api.spotify.com/v1/browse/categories/' + encodeURIComponent(category_id) + '/playlists?country=' + encodeURIComponent(country_id) + '&limit=50';
        this.general.getURL(url, callback, message);
    }

    browse.prototype.getGenres = function(callback, message) {
        var url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
        this.general.getURL(url, callback, message);
    }

    // TO DO:
    // - add browse getRecommendations()

    var follow = function(general) {
        this.general = general;
        this.login   = general.login;
    }

    follow.prototype.getFollowedArtists = function(callback, message) {
        var url = 'https://api.spotify.com/v1/me/following?limit=50';
        this.general.getURL(url, callback, message);
    }

    follow.prototype.checkFollowed = function(type, ids, callback, message) {
        var url = 'https://api.spotify.com/v1/me/following/contains?ids=' + encodeURIComponent(ids.join(',')) + '&limit=50&type=' + encodeURIComponent(type);
        this.general.getURL(url, callback, message);
    }

    follow.prototype.checkUsersFollowPlaylist = function(owner_id, playlist_id, check_ids, callback, message) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(owner_id) + '/playlists/' + encodeURIComponent(playlist_id) + '/followers/contains?ids=' + encodeURIComponent(check_ids.join(','));
        this.general.getURL(url, callback, message);
    }

    var SpotifyAPI = function() {
        this.login     = new login();
        this.general   = new general(this.login);
        this.search    = new search(this.general);
        this.track     = new track(this.general);
        this.artist    = new artist(this.general);
        this.album     = new album(this.general);
        this.playlist  = new playlist(this.general);
        this.library   = new library(this.general);
        this.browse    = new browse(this.general);
        this.follow    = new follow(this.general);
    }

    exports.SpotifyAPI = SpotifyAPI;

})(window || this);
