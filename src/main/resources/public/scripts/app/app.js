(function () {
    define(["angular", "app.config", "app.run", "login/login.module", "app.controller",
        "dashboard/dashboard.module", "project/project.module",
        "admin/admin.module", "profil/profil.controller",
        "uiRouter", "ngStorage", "ngAuth", "xeditable", "ngResource", "ngSortable",
        "hateoas", "uiBootstrap", "uiBootstrapTpl", "ngSanitize", "bootstrap"],
            function (angular, appConfig, appRun, loginModule, appController,
                    dashboardModule, projectModule, adminModule, profilController) {
                var app = angular.module("kanban",
                        ["ui.router", "ngStorage", "ngSanitize", "ui.sortable",
                            "http-auth-interceptor", "xeditable", "ngResource",
                            "hateoas", "ui.bootstrap", "ui.bootstrap.tpls",
                            loginModule.name, dashboardModule.name,
                            projectModule.name, adminModule.name])
                        .config(appConfig)
                        .run(appRun)
                        .controller("appController", appController)
                        .controller("profilController", profilController);
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [app.name]);
                });
             });
})();