(function () {
    define(['angular', "login/auth.service", "login/currentuser.service",
        "login/login.controller"],
            function (angular, appAuthService, currentUserService, loginController) {
                return angular.module('kanban.login', [])
                        .controller("loginController", loginController)
                        .service("appAuthService", appAuthService)
                        .service("currentUserService", currentUserService);
                ;
            });
})();