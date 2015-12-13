(function () {
    define([], function () {
        var appController = function (currentuser, $sessionStorage, $state) {
            var vm = this;
            vm.currentuser = currentuser;
            currentuser.$promise.then(function () {
                currentuser.resource("project").get(
                        function (data) {
                            vm.currentuser.projects = data._embedded.projectResourceList;
                        });
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
