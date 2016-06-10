var config = function ($stateProvider) {
    $stateProvider.state("app.parameter", {
        templateUrl: "templates/admin/parameter/list.html",
        controller: "listParameterAdminController",
        controllerAs: "parameterCtrl",
        url: "parameter"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;
