(function() {

    var angularify = angular.module('angularify', [
        'ngRoute',
        'angularify-home',
        'angularify-browse'
    ]);

    angularify.config(function($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo : '/'
            })
    });

}());