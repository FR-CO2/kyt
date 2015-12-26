(function () {
    define(['angular', "project/consommation/consommation.config",
        "project/consommation/consommation.controller",
        "project/consommation/member.controller",
        "project/consommation/task.controller"],
            function (angular, config, consommationController, memberController,
                    taskContoller) {
                return angular.module('kanban.project.consommation', [])
                        .config(config)
                        .controller("consommationController", consommationController)
                        .controller("memberConsommationController", memberController)
                        .controller("taskConsommationController", taskContoller);
            });
})();