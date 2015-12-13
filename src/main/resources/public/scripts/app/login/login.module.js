(function () {
    define(['angular', "login/auth.service", "login/currentuser.service",
        "login/login.controller"],
            function (angular, authService, currentUserService, loginController) {
                return angular.module('kanban.login', [])
                        .controller("loginController", loginController)
                        .service("authService", authService)
                        .service("currentUserService", currentUserService);
                ;
            });
})();