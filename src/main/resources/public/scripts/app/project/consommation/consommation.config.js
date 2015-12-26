(function () {
    define([], function () {

        var config = function ($stateProvider) {
            $stateProvider.state("app.project.consommation", {
                controller: "consommationController",
                controllerAs: "consommationCtrl",
                templateUrl: "templates/project/consommation/layout.html",
                url: "consommation",
            });
            $stateProvider.state("app.project.consommation.member", {
                controller: "memberConsommationController",
                controllerAs: "consommationCtrl",
                templateUrl: "templates/project/consommation/member.html",
                url: "/member"
            });
            $stateProvider.state("app.project.consommation.task", {
                controller: "taskConsommationController",
                controllerAs: "consommationCtrl",
                templateUrl: "templates/project/consommation/task.html",
                url: "/task"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

