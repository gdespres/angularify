(function() {

    var ovh = angular.module('ovh', []);

    ovh.factory('OVHApi', function($http) {

        var API_BASE_URL       = "https://eu.api.ovh.com/1.0",
            APPLICATION_KEY    = 'KZcxnUadrczt0EU7',
            APPLICATION_SECRET = 'hAZhcOxO2F6fi9zdDlsmWg8LY7SrDs0M',
            CONSUMER_KEY       = 'DSAzw6Ak8tIQuK8grARzD18r5tSVoLI4';

        var call = function(method, url, data) {

            var url = API_BASE_URL + url;
            var time = Math.floor(Date.now() / 1000);
            var body = (data === undefined) ? '' : JSON.stringify(data);
            var signature = '$1$' + sha1(APPLICATION_SECRET + '+' + CONSUMER_KEY + '+' + 'GET' + '+' + url + '+' + body + '+' + time);

            return $http({
                method : method,
                url : url,
                headers : {
                    'X-Ovh-Application' : APPLICATION_KEY,
                    'X-Ovh-Consumer' : CONSUMER_KEY,
                    'X-Ovh-Signature' : signature,
                    'X-Ovh-Timestamp' : time
                },
                data : data
            });
        }

        return {
            getEmailDomains : function() {
                return call('GET', '/email/domain');
            },
            getEmailRedirections : function(domain, from) {
                var url = '/email/domain/' + domain + '/redirection';
                if (from) {
                    url += '?from=' + from;
                }
                return call('GET', url);
            },
            getEmailRedirection : function(domain, redirectionId) {
                return call('GET', '/email/domain/' + domain + '/redirection/' + redirectionId);
            }
        }
    })

}());