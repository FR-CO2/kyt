
var appConfig = require("./app.config");
var appRun = require("./app.run");
var loginModule = require("./login/login.module");
var appController = require("./app.controller");
var dashboardModule = require("./dashboard/dashboard.module");
var projectModule = require("./project/project.module");
var samePasswordDirective = require("./directive/samePassword.directive");
var errorDirective = require("./directive/error.directive");
var adminModule = require("./admin/admin.module");
var profilController = require("./profil/profil.controller");

angular.module("kanban",
        ["ui.router", "ngStorage", "ngSanitize", "ui.sortable", "angularMoment",
            "http-auth-interceptor", "xeditable", "ngResource",
            "hateoas", "ui.bootstrap", "ui.bootstrap.tpls", "ngImgCrop", "textAngular",
            loginModule.name, dashboardModule.name,
            projectModule.name, adminModule.name])
        .config(appConfig)
        .run(appRun)
        .controller("appController", appController)
        .controller("profilController", profilController)
        .directive("samePassword", samePasswordDirective)
        .directive("errors", errorDirective);

