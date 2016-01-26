(function () {
    define([], function () {
        var appController = function ($http, currentuser, scope, $sessionStorage, $state) {
            var vm = this;
            vm.currentuser = currentuser;
            currentuser.$promise.then(function () {
                currentuser.projects = currentuser.resource("project").query();
                if (currentuser._links.photo) {
                    $http.get(currentuser._links.photo).then(function (result) {
                        currentuser.photo = result.data;
                    });
                };
            });
            vm.logout = function () {
                delete $sessionStorage.oauth;
                $state.transitionTo("login");
            };
            scope.$on("kanban:projects-updates", function () {
                currentuser.projects = currentuser.resource("project").query();
            });
        };
        appController.$inject = ["$http", "currentuser", "$scope", "$sessionStorage", "$state"];
        return appController;
    });
})();
