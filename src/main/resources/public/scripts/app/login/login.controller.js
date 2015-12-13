/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {

        var loginController = function ($state, $sessionStorage, authService) {
            var vm = this;
            vm.authenticate = function () {
                authService.login(vm.loginForm).success(function (result) {
                    $sessionStorage.oauth = result;
                    $state.transitionTo("app.dashboard");
                }).error(function () {
                    vm.loginForm = {};
                    vm.loginForm.error = "Login/password invalide";
                });
            };
        };
        loginController.$inject = ["$state", "$sessionStorage", "authService"];
        return loginController;
    });
})();