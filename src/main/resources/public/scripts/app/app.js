(function () {
    define(["angular", "app.config", "app.run", "login/login.module", "app.controller",
        "dashboard/dashboard.module", "project/project.module", "directive/samePassword.directive",
        "directive/error.directive", "admin/admin.module", "profil/profil.controller", "moment",
        "rangy","rangySelection",
        "uiRouter", "ngStorage", "ngAuth", "xeditable", "ngResource", 
        "ngSortable", "hateoas", "uiBootstrap", "uiBootstrapTpl", 
        "textAngularSanitize", "growl", "ngImgCrop", "textAngular"],
            function (angular, appConfig, appRun, loginModule, appController,
                    dashboardModule, projectModule, samePasswordDirective, 
                    errorDirective, adminModule, profilController, moment, rangy, rangySelection) {
                        window.rangy = rangy;
                        window.rangy.saveSelection = rangySelection.saveSelection;
                var app = angular.module("kanban",
                        ["ui.router", "ngStorage", "ngSanitize", "ui.sortable",
                            "http-auth-interceptor", "xeditable", "ngResource",
                            "hateoas", "ui.bootstrap", "ui.bootstrap.tpls", "ngImgCrop", "textAngular",
                            loginModule.name, dashboardModule.name,
                            projectModule.name, adminModule.name])
                        .config(appConfig)
                        .run(appRun)
                        .controller("appController", appController)
                        .controller("profilController", profilController)
                        .value("moment", moment)
                        .directive("samePassword", samePasswordDirective)
                        .directive("errors", errorDirective);
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [app.name]);
                });
             });
})();