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
                controller: "taskController",
                controllerAs: "taskCtrl",
                resolve: {
                    task: resolveTask
                },
                url: "task/:taskId"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

