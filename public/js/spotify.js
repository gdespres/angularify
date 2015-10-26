(function() {

    var spotify = angular.module('spotify', []);

    spotify.factory('SpotifyAuth', function($rootScope, $window) {

        var LS_SPOTIFY_AUTH = 'spotify.auth',
            spotifyAuthString = $window.localStorage.getItem(LS_SPOTIFY_AUTH);

        var spotifyAuth = spotifyAuthString ? JSON.parse(spotifyAuthString) : {
            access_token : undefined,
            refresh_token : undefined
        }

        $rootScope.$watch(function() { return spotifyAuth; }, function() {
            console.info('SpotifyAuth::$watch : ', spotifyAuth);
            $window.localStorage.setItem(LS_SPOTIFY_AUTH, JSON.stringify(spotifyAuth));
        }, true);

        return spotifyAuth;
    });

    spotify.factory('SpotifyAuthService', function(SpotifyAuth) {

        return {
            isAuthenticated : function() {},
            authenticate : function(auth) {
                SpotifyAuth.access_token = auth.access_token;
                SpotifyAuth.refresh_token = auth.refresh_token;
            },
            login : function() {
                window.location = "/login";
            },
            logout : function() {
                SpotifyAuth.access_token = undefined;
                SpotifyAuth.refresh_token = undefined;
                this.login();
            },
            refreshToken : function() {}
        }
    });

    spotify.factory('SpotifyService', function($http, SpotifyAuth) {

        var API_BASE_URL = "https://api.spotify.com";

        return {
            browseNewReleases : function() {
                return $http.get(API_BASE_URL + '/v1/browse/new-releases?country=FR', {
                    headers : {
                        'Authorization' : 'Bearer ' + SpotifyAuth.access_token
                    }
                });
            },
            album : function(id) {
                return $http.get(API_BASE_URL + '/v1/albums/' + id);
            }
        }
    })

    .factory('SpotifyHttpLogInterceptor', ['$q', function($q) {
        return {
            'response': function(response) {
                if (response.config.url.indexOf('https://api.spotify.com') == 0) { // On ne log que les appels à l'api
                    console.info(response.config.method + " " + response.config.url + " " + response.status + " : ", response.data);
                }
                return response;
            },
            'responseError': function(rejection) {
                if (rejection.config.url.indexOf('https://api.spotify.com') == 0) { // On ne log que les appels à l'api
                    console.error(rejection.config.method + " " + rejection.config.url + " " + rejection.status + " : ", rejection.data);
                }
                return $q.reject(rejection);
            }
        }
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('SpotifyHttpLogInterceptor');
    }])

}());