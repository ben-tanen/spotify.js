(function(exports) {

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

        if (hash.match('access_token=.*')) {
            if (loud) console.log('pulling access token...');
            var all = hash.split('&');
            all.forEach(function(keyvalue) {
                var idx = keyvalue.indexOf('=');
                var key = keyvalue.substring(0, idx);
                var val = keyvalue.substring(idx + 1);
                if (key == 'access_token') {
                    api.login.setAccessToken(val);
                    api.login.getUserInfo(function(userinfo) {
                        api.login.setUsername(userinfo.id);
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

    var user = function(login) {
        this.login = login;
    }

    login.prototype.getUserInfo = function(callback, loud) {
        var url = 'https://api.spotify.com/v1/me';
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('user info:', r);
                callback(r);
            }
        });
    }

    /*
    Spotify General API:
        getSelfInfo(callback, loud)
        getUserInfo(user_id, callback, loud)
    */
    var general = function(login) {
        this.login = login;
    }

    general.prototype.getUserInfo = function(user_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id);
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('user info:', r);
                callback(r);
            }
        });
    }

    general.prototype.getURL = function(url, callback, loud) {
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('result:', r);
                callback(r);
            }
        });
    }

    /*
    Spotify Search API:
        searchTracks(query, callback, loud)
    */
    var search = function() {
    }

    search.prototype.searchTracks = function(query, callback, loud) {
        var url = 'https://api.spotify.com/v1/search?type=track&q='+encodeURIComponent(query);
        $.ajax(url, {
            dataType: 'json',
            success: function(r) {
                if (loud) console.log('got track results:', r);
                callback(r.tracks.items);
            }
        });
    }

    /*
    Spotify Track API:
        getTrack(track_id, callback, loud)
        getTracks(track_ids, callback, loud)
        getTrackAudioFeatures(track_id, callback, loud)
        getTracksAudioFeatures(track_ids, callback, loud)
    */
    var track = function(login) {
        this.login = login;
    }

    // get info for a track
    track.prototype.getTrack = function(track_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/tracks/'+encodeURIComponent(track_id);
        $.ajax(url, {
            dataType: 'json',
            success: function(r) {
                if (loud) console.log('got track:', r);
                callback(r);
            }
        });
    }

    // get info for multiple tracks
    track.prototype.getTracks = function(track_ids, callback, loud) {
        var url = 'https://api.spotify.com/v1/tracks?ids='+encodeURIComponent(track_ids.join(','));
        $.ajax(url, {
            dataType: 'json',
            success: function(r) {
                if (loud) console.log('got tracks:', r);
                callback(r);
            }
        });
    }

    // get audio features for a track
    track.prototype.getTrackAudioFeatures = function(track_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/audio-features/'+encodeURIComponent(track_id);
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got track features:', r);
                callback(r);
            }
        });
    }

    // get audio features for multiple tracks
    track.prototype.getTracksAudioFeatures = function(track_ids, callback, loud) {
        var url = 'https://api.spotify.com/v1/audio-features?ids='+encodeURIComponent(track_ids.join(','));
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got tracks features:', r);
                callback(r);
            }
        });
    }

    // get audio analysis for a track
    track.prototype.getTrackAudioAnalysis = function(track_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/audio-analysis/'+encodeURIComponent(track_id);
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got track analysis:', r);
                callback(r);
            }
        });
    }

    /*
    Spotify Playlists API:
        getUserPlaylists(callback, loud)
        getPlaylists(user_id, callback, loud)
        getPlaylist(user_id, playlist_id, loud)
    */
    var playlists = function(login) {
        this.login = login;
    }

    // get list of user's playlists
    playlists.prototype.getUserPlaylists = function(callback, loud) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(this.login.getUsername()) + '/playlists';
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got playlists:', r);
                callback(r);
            }
        });
    }

    // get list of playlist from a particular user
    playlists.prototype.getPlaylists = function(user_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists';
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got playlists:', r);
                callback(r);
            }
        });
    }

    // get a playlist from a particular user
    playlists.prototype.getPlaylist = function(user_id, playlist_id, callback, loud) {
        var url = 'https://api.spotify.com/v1/users/' + encodeURIComponent(user_id) + '/playlists/' + encodeURIComponent(playlist_id);
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': this.login.getAuthHeader()
            },
            success: function(r) {
                if (loud) console.log('got playlist:', r);
                callback(r);
            }
        });
    }

    // TO ADD:
    // - create playlist
    // - delete playlist
    // - add track to playlist
    // - remove track from playlist
    // - order or replace playlist tracks
    // - change playlist details

    var SpotifyAPI = function() {
        this.login     = new login();
        this.general   = new general(this.login);
        this.search    = new search();
        this.track     = new track(this.login);
        this.playlists = new playlists(this.login);
    }

    exports.SpotifyAPI = SpotifyAPI;

})(window || this);
