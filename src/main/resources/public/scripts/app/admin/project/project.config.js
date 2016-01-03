(function () {
    define([], function () {
        var config = function ($stateProvider) {
            $stateProvider.state("app.projects", {
                controller: "listProjectAdminController",
                controllerAs: "projectListAdminCtrl",
                templateUrl: "templates/admin/project/list.html",
                url: "project"
            });
            $stateProvider.state("app.project.edit", {
                controller: "editProjectAdminController",
                controllerAs: "projectEditCtrl",
                templateUrl: "templates/admin/project/project.html",
                url: "edit"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

