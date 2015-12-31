(function () {
    define([], function () {

        var resolveProject = function ($stateParams, projectService) {
            return projectService.get({"projectId": $stateParams.projectId});
        };
        resolveProject.$inject = ["$stateParams", "projectService"];

        var resolveUserRights = function ($stateParams, currentuser) {
            var rights = {
                hasAdminRights: false,
                hasEditRights: false,
                hasReadRights: false
            };
            currentuser.$promise.then(function () {
                var isAdmin = (currentuser.applicationRole === "ADMIN");
                currentuser.resource("member").get({"projectId": $stateParams.projectId}, function (data) {
                    rights = {
                        hasAdminRights: (isAdmin || data.projectRole === "MANAGER"),
                        hasEditRights: (isAdmin || data.projectRole === "MANAGER" || data.projectRole === "CONTRIBUTOR"),
                        hasReadRights: (isAdmin || data)
                    };
                });
            });
            return rights;
        };
        resolveUserRights.$inject = ["$stateParams", "currentuser"];

        var config = function ($stateProvider) {
            $stateProvider.state("app.project", {
                abstract: true,
                controller: "projectController",
                controllerAs: "projectCtrl",
                templateUrl: "templates/project/layout-single.html",
                url: "project/:projectId/",
                resolve: {
                    project: resolveProject,
                    userRights: resolveUserRights
                }
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

