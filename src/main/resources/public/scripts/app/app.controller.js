(function () {
    define([], function () {
        var appController = function (currentuser, scope, $sessionStorage, $state) {
            var vm = this;
            vm.currentuser = currentuser;
            currentuser.$promise.then(function () {
                currentuser.projects = currentuser.resource("project").query();
            });
            vm.logout = function () {
                delete $sessionStorage.oauth;
                $state.transitionTo("login");
            };
            scope.$on("kanban:projects-updates", function() {
                currentuser.projects = currentuser.resource("project").query();
            });
        };
        appController.$inject = ["currentuser", "$scope", "$sessionStorage", "$state"];
        return appController;
    });
})();
