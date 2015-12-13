(function () {
    define([], function () {

        var resolveProject = function ($stateParams, projectService) {
            return projectService.get({"projectId": $stateParams.projectId});
        };
        resolveProject.$inject = ["$stateParams", "projectService"];
        
        var resolveUserRights = function($stateParams, currentuser) {
            return {
                hasAdminRights : true,
                hasEditRights : true,
                hasReadRights : true
            };
        };
        resolveUserRights.$inject = ["$stateParams", "currentuser"];
        
        var config = function ($stateProvider) {
            $stateProvider.state("app.project", {
                abstract: true,
                controller: "projectController",
                controllerAs: "projectCtrl",
                templateUrl: "templates/projects/layout-single.html",
                url: "project/:projectId/",
                resolve: {
                    project: resolveProject,
                    userRights : resolveUserRights
                }
            });
            $stateProvider.state("app.project.kanban", {
                templateUrl: "templates/projects/kanban.html",
                controller: "kanbanController",
                controllerAs: "kanbanCtrl",
                url: "kanban"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

