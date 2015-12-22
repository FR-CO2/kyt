(function () {
    define([], function () {
        var dashboardController = function (currentuser) {
            var vm = this;
            currentuser.$promise.then(function(){
                vm.tasks = currentuser.resource("task").get();
            });
        };
        dashboardController.$inject = ["currentuser"];
        return dashboardController;
    });
})();