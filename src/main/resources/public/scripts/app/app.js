
var appConfig = require("./app.config");
var appRun = require("./app.run");
var loginModule = require("./login/login.module");
var appController = require("./app.controller");
var dashboardModule = require("./dashboard/dashboard.module");
var projectModule = require("./project/project.module");
var samePasswordDirective = require("./directive/samePassword.directive");
var checkboxFilterDirective = require("./directive/checkboxfilter.directive");
var errorDirective = require("./directive/error.directive");
var togglerDirective = require("./directive/toggler.directive");
var adminModule = require("./admin/admin.module");
var profilController = require("./profil/profil.controller");
var parameterModule = require("./parameter/parameter.module");

angular.module("kanban",
        ["ui.router", "ngStorage", "ngSanitize", "ui.sortable", "angularMoment",
            "http-auth-interceptor", "xeditable", "ngResource",
            "hateoas", "ui.bootstrap", "ui.bootstrap.tpls", "ngImgCrop", "textAngular", "infinite-scroll",
            loginModule.name, dashboardModule.name,
            projectModule.name, adminModule.name, parameterModule.name])
        .config(appConfig)
        .run(appRun)
        .controller("appController", appController)
        .controller("profilController", profilController)
        .directive("checkboxFilter", checkboxFilterDirective)
        .directive("samePassword", samePasswordDirective)
        .directive("errors", errorDirective)
        .directive("toggler", togglerDirective);

