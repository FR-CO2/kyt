(function () {
    define(['angular', "project/consommation/consommation.config",
        "project/consommation/consommation.controller",
        "project/consommation/member.controller",
        "project/consommation/task.controller",
        "project/consommation/consommation.factory",
        "project/consommation/task.service"],
            function (angular, config, consommationController, memberController,
                    taskContoller, filterFactory, taskService) {
                return angular.module('kanban.project.consommation', [])
                        .config(config)
                        .controller("consommationController", consommationController)
                        .controller("memberConsommationController", memberController)
                        .controller("taskConsommationController", taskContoller)
                        .factory("consommationFilterFactory", filterFactory)
                        .service("consomationTaskService", taskService);
            });
})();