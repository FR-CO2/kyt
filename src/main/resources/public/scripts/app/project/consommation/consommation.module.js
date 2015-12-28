(function () {
    define(['angular', "project/consommation/consommation.config",
        "project/consommation/consommation.controller",
        "project/consommation/consommation.service"],
            function (angular, config, consommationController, consoService) {
                return angular.module('kanban.project.consommation', [])
                        .config(config)
                        .controller("consommationController", consommationController)
                        .service("consomationService", consoService);
            });
})();