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
                var parentState = $state.get("^");
                console.log(parentState);
                if (parentState.abstract) {
                    $state.go("app.dashboard");
                } else {
                    $state.go(parentState);
                }
            });
            $rootScope.$on("event:auth-loginRequired", function () {
                delete $sessionStorage.oauth;
                var modalScope = $rootScope.$new();
                if (!$rootScope.loginOngoing) {
                    $rootScope.loginOngoing = true;
                    modalScope.modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: "login.html",
                        controller: "loginController",
                        controllerAs: "login",
                        scope: modalScope,
                        backdrop: "static",
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


