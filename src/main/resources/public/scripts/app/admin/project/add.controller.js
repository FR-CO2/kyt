(function () {
    define([], function () {
        var addController = function ($uibModalInstance, projects ) {
            var vm = this;
            vm.submit = function () {
                projects.resource("self").save(vm.project, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "projects"];
        return addController;
    });
})();