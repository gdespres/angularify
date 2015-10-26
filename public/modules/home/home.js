(function() {

    var homeModule = angular.module('angularify-home', [
        'ngRoute',
        'spotify',
        'ovh'
    ]);

    homeModule.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'modules/home/home.html',
                controller : 'HomeController'
            })
            .when('/auth/login', {
                resolve : {
                    login : function(SpotifyAuthService) {
                        SpotifyAuthService.login();
                    }
                }
            })
            .when('/auth/callback', {
                resolve : {
                    redirect : function($location, $route, SpotifyAuthService) {
                        SpotifyAuthService.authenticate($route.current.params);
                        $location.url('/');
                    }
                }
            })
            .when('/auth/logout', {
                resolve : {
                    logout : function(SpotifyAuthService) {
                        SpotifyAuthService.logout();
                    }
                }
            })
    });

    homeModule.controller('HomeController', function($scope, $q, SpotifyService, OVHApi) {

        $scope.title = 'Home';

        // SpotifyService.browseNewReleases().then(function(response) {
        //     $scope.newReleases = response.data;
        // });
        OVHApi.getEmailDomains().then(function(response) {
            $scope.domains = response.data;
        });

        OVHApi.getEmailRedirections('espchartreshandball.fr', 'pole-animation@espchartreshandball.fr').then(function(response) {
            var promises = []
            response.data.forEach(function(redirectionId) {
                promises.push(OVHApi.getEmailRedirection('espchartreshandball.fr', redirectionId));
            });
            $q.all(promises).then(function(responses) {
                $scope.redirections = [];
                responses.forEach(function(response) {
                    $scope.redirections.push(response.data);
                });
            });
        });
    });

}());