(function () {
    define(['angular', "project/task/task.config", "project/task/task.service",
        "project/task/tasklist.controller", "project/task/task.controller",
        "project/task/history/history.controller",
        "project/task/allocation/allocation.controller",
        "project/task/comment/comment.controller",
        "project/task/taskAssembler.service"],
            function (angular, config, taskService,
                    tasklistController, taskController,
                    historyController, allocationController,
                    commentController, taskAssemblerService) {
                return angular.module('kanban.project.task', [])
                        .config(config)
                        .controller("tasklistController", tasklistController)
                        .controller("taskController", taskController)
                        .controller("historyController", historyController)
                        .controller("allocationController", allocationController)
                        .controller("commentController", commentController)
                        .service("taskService", taskService)
                        .service("taskAssemblerService", taskAssemblerService);
            });
})();