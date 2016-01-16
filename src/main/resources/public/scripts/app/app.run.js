/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    define([], function () {
        var appRun = function ($rootScope, $sessionStorage, $state, $uibModal, authService, editableOptions) {
            editableOptions.theme = 'bs3';
            $rootScope.loginOngoing = false;
            $rootScope.$on("event:auth-forbidden", function () {
                $state.go("app.dashboard");
            });
            $rootScope.$on("event:auth-loginRequired", function () {
                delete $sessionStorage.oauth;
                var modalScope = $rootScope.$new();
                if (!$rootScope.loginOngoing) {
                    $rootScope.loginOngoing = true;
                    modalScope.modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        templateUrl: "login.html",
                        controller: "loginController",
                        controllerAs: "login",
                        scope: modalScope,
                        keyboard: false,
                        size: "md"
                    });
                    modalScope.modalInstance.result.then(
                            function () {
                                authService.loginConfirmed();
                                $rootScope.loginOngoing = false;
                            }
                    );
                }
            });
            $state.go("login");
        };
        appRun.$inject = ["$rootScope", "$sessionStorage", "$state", "$uibModal", "authService", "editableOptions"];
        return appRun;
    });
})();


