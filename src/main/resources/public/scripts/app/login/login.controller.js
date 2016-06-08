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
module.exports = loginController;