var config = function ($stateProvider) {
    $stateProvider.state("app.users", {
        templateUrl: "templates/admin/user/list.html",
        controller: "listUserAdminController",
        controllerAs: "usersCtrl",
        url: "users"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;
