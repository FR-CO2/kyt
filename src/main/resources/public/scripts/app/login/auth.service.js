/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    define([], function () {

        var appAuthService = function appAuthService($http) {
            return {
                login: function (credentials) {
                    var config = {
                        method: "POST",
                        url: "/oauth/token",
                        headers: {
                            Authorization: "Basic " + btoa("clientapp:123456")
                        },
                        withCredentials: true,
                        params: {
                            username: credentials.username,
                            password: credentials.password,
                            grant_type: "password",
                            scope: "read write"
                        }
                    };
                    return $http(config);
                }
            };
        };
        appAuthService.$inject = ["$http"];
        return appAuthService;
    });
})();