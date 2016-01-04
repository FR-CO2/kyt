/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {

        var loginController = function (scope, $state, $sessionStorage, appAuthService) {
            var vm = this;
            vm.authenticate = function () {
                appAuthService.login(vm.loginForm).success(function (result) {
                    $sessionStorage.oauth = result;
                    if (scope.modalInstance) {
                        scope.modalInstance.close();
                    }
                    $state.transitionTo("app.dashboard");
                }).error(function () {
                    vm.loginForm = {};
                    vm.loginForm.error = "Login/password invalide";
                });
            };
        };
        loginController.$inject = ["$scope", "$state", "$sessionStorage", "appAuthService"];
        return loginController;
    });
})();