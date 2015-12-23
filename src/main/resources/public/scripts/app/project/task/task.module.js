(function () {
    define(['angular', "project/task/task.config", "project/task/task.service",
        "project/task/list.controller", "project/task/task.controller",
        "project/task/add.controller", "project/task/history/history.controller",
        "project/task/allocation/allocation.controller",
        "project/task/comment/comment.module",
        "project/task/taskAssembler.service"],
            function (angular, config, taskService,
                    tasklistController, taskController, addTaskController,
                    historyController, allocationController,
                    commentModule, taskAssemblerService) {
                return angular.module('kanban.project.task', [commentModule.name])
                        .config(config)
                        .controller("addTaskController", addTaskController)
                        .controller("tasklistController", tasklistController)
                        .controller("taskController", taskController)
                        .controller("historyController", historyController)
                        .controller("allocationController", allocationController)
                        .service("taskService", taskService)
                        .service("taskAssemblerService", taskAssemblerService);
            });
})();