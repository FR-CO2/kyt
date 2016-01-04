(function () {
    define([], function () {
        var appController = function (currentuser, $sessionStorage, $state) {
            var vm = this;
            vm.currentuser = currentuser;
            currentuser.$promise.then(function () {
                currentuser.projects = currentuser.resource("project").query();
            });
            vm.logout = function () {
                delete $sessionStorage.oauth;
                $state.transitionTo("login");
            };
        };
        appController.$inject = ["currentuser", "$sessionStorage", "$state"];
        return appController;
    });
})();
