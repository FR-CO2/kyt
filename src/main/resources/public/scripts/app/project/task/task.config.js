(function () {
    define([], function () {

        var resolveTask = function ($stateParams, taskService) {
            return taskService.get($stateParams.taskId);
        };
        resolveTask.$inject = ["$stateParams", "taskService"];

        var config = function ($stateProvider) {
            $stateProvider.state("app.project.tasks", {
                templateUrl: "templates/projects/tasks/list.html",
                controller: "tasklistController",
                controllerAs: "tasksCtrl",
                url: "/tasks"
            });
            $stateProvider.state("app.project.task", {
                templateUrl: "templates/projects/tasks/task-layout.html",
                controller: "editTaskController",
                controllerAs: "edit",
                resolve: {
                    task: resolveTask
                },
                url: "/task/:taskId"
            });
            $stateProvider.state("app.project.task.general", {
                templateUrl: "templates/projects/tasks/edit.html",
                controller: "editTaskController",
                controllerAs: "edit",
                url: "/general"
            });
            $stateProvider.state("app.project.task.allocation", {
                templateUrl: "templates/projects/tasks/timesheet/synthese.html",
                controller: "timesheetSynthese",
                controllerAs: "allocation",
                url: "/allocation"
            });
            $stateProvider.state("app.project.task.comment", {
                templateUrl: "templates/projects/tasks/comment/list.html",
                controller: "commentListController",
                controllerAs: "comment",
                url: "/comment"
            });
            $stateProvider.state("app.project.task.history", {
                templateUrl: "templates/projects/tasks/history/list.html",
                controller: "historyListController",
                controllerAs: "history",
                url: "/history"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

