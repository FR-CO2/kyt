(function () {
    define([], function () {
        var dashboardController = function (currentuser) {
            var vm = this;
            currentuser.$promise.then(function(){
                currentuser.resource("task").get(null, function(data) {
                          vm.tasks = data._embedded;
                });
            });
        };
        dashboardController.$inject = ["currentuser"];
        return dashboardController;
    });
})();