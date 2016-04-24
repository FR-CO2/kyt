var resolveProject = function ($stateParams, projectService) {
    return projectService.get({"projectId": $stateParams.projectId});
};
resolveProject.$inject = ["$stateParams", "projectService"];

var resolveUserRights = function ($q, $stateParams, currentuser) {
    var defer = $q.defer();
    currentuser.$promise.then(function () {
        var isAdmin = (currentuser.applicationRole === "ADMIN");
        currentuser.resource("member").get({"projectId": $stateParams.projectId}, function (data) {
            var projectRole = data.projectRole;
            var rights = {
                hasAdminRights: (isAdmin || projectRole === "MANAGER"),
                hasEditRights: (isAdmin || projectRole === "MANAGER" || projectRole === "CONTRIBUTOR"),
                hasReadRights: (isAdmin || projectRole)
            };
            defer.resolve(rights);
        });
    });
    return defer.promise;
};
resolveUserRights.$inject = ["$q", "$stateParams", "currentuser"];

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
    $stateProvider.state("app.project.gantt", {
        templateUrl: "templates/project/gantt/gantt.html",
        controller: "ganttController",
        controllerAs: "ganttCtrl",
        url: "gantt"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

