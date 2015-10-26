(function() {

    var browseModule = angular.module('angularify-browse', [
        'ngRoute',
        'spotify'
    ]);

    browseModule.directive('browseAlbum', function() {
        return {
            restrict : 'E',
            templateUrl : 'modules/browse/directives-browse-album.html',
            scope : {
                albumId : '=id'
            },
            controller : function($scope, $routeParams, SpotifyService) {
                var id = ($routeParams && $routeParams.albumId) ? $routeParams.albumId : $scope.albumId;
                SpotifyService.album(id).then(function(response) {
                    $scope.album = response.data;
                });
            }
        }
    });
}());