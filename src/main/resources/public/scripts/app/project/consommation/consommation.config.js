(function () {
    define([], function () {

        var config = function ($stateProvider) {
            $stateProvider.state("app.project.consommation", {
                controller: "consommationController",
                controllerAs: "consommationCtrl",
                templateUrl: "templates/project/consommation/member.html",
                url: "consommation"
            });
        };
        config.$inject = ["$stateProvider"];
        return config;
    });
})();

