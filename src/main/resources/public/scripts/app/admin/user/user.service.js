/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {
        var userService = function ($resource) {
            return $resource("/api/user");
        };
        userService.$inject = ["$resource"];
        return userService;
    });
})();
