(function () {
    define([], function () {
        var config = function ($stateProvider) {
            $stateProvider.state("app.project", {
                abstract: true,
                controller: "projectController",
                controllerAs: "projectCtrl",
                templateUrl: "templates/project/layout-single.html",
                url: "project/:projectId/",
            });
            $stateProvider.state("app.project.kanban", {
                templateUrl: "templates/project/kanban/kanban.html",
                controller: "kanbanController",
                controllerAs: "kanbanCtrl",
                url: "kanban"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

