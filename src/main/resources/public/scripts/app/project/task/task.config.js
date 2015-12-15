(function () {
    define([], function () {

        var resolveTask = function ($stateParams, taskService) {
            return taskService.get({"projectId": $stateParams.projectId, "taskId": $stateParams.taskId});
        };
        resolveTask.$inject = ["$stateParams", "taskService"];

        var config = function ($stateProvider) {
            $stateProvider.state("app.project.tasks", {
                templateUrl: "templates/project/task/list.html",
                controller: "tasklistController",
                controllerAs: "tasksCtrl",
                url: "tasks"
            });
            $stateProvider.state("app.project.task", {
                templateUrl: "templates/project/task/task.html",
                controllerAs: "task",
                resolve: {
                    task: resolveTask
                },
                url: "task/:taskId"
            });
            $stateProvider.state("app.project.task.allocation", {
                templateUrl: "templates/project/task/allocation/list.html",
                controller: "allocationController",
                controllerAs: "allocation",
                url: "/allocation"
            });
            $stateProvider.state("app.project.task.comment", {
                templateUrl: "templates/project/task/comment/list.html",
                controller: "commentController",
                controllerAs: "comment",
                url: "/comment"
            });
            $stateProvider.state("app.project.task.history", {
                templateUrl: "templates/project/task/history/list.html",
                controller: "historyController",
                controllerAs: "history",
                url: "/history"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

