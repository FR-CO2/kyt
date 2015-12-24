(function () {
    define(['angular', "project/task/task.config", "project/task/task.service",
        "project/task/list.controller", "project/task/task.controller",
        "project/task/add.controller", "project/task/history/history.controller",
        "project/task/allocation/allocation.module",
        "project/task/comment/comment.module",
        "project/task/taskAssembler.service"],
            function (angular, config, taskService,
                    tasklistController, taskController, addTaskController,
                    historyController, allocationModule,
                    commentModule, taskAssemblerService) {
                return angular.module('kanban.project.task', [commentModule.name, allocationModule.name])
                        .config(config)
                        .controller("addTaskController", addTaskController)
                        .controller("tasklistController", tasklistController)
                        .controller("taskController", taskController)
                        .controller("historyController", historyController)
                        .service("taskService", taskService)
                        .service("taskAssemblerService", taskAssemblerService);
            });
})();