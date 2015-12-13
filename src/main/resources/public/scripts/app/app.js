(function () {
    define(["angular", "app.config", "login/login.module", "app.controller",
        "dashboard/dashboard.module", "project/project.module",
        "uiRouter", "ngStorage", "ngAuth", "xeditable", "ngResource",
        "hateoas", "uiBootstrap", "uiBootstrapTpl", "ngSanitize", "bootstrap"],
            function (angular, appConfig, loginModule, appController,
                    dashboardModule, projectModule) {
                function runApp($state) {
                    $state.go("login");
                }
                runApp.$inject = ["$state"];
                var app = angular.module("kanban",
                        ["ui.router", "ngStorage", "ngSanitize",
                            "http-auth-interceptor", "xeditable", "ngResource",
                            "hateoas", "ui.bootstrap", "ui.bootstrap.tpls",
                            loginModule.name, dashboardModule.name, projectModule.name])
                        .config(appConfig)
                        .run(runApp)
                        .controller("appController", appController);
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [app.name]);
                });
             });
})();