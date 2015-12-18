(function () {
    define([], function () {
        var config = function ($stateProvider) {
            $stateProvider.state("app.projects", {
                controller: "listProjectAdminController",
                controllerAs: "projectListAdminCtrl",
                templateUrl: "templates/admin/project/list.html",
                url: "project"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

