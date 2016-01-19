(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.swimlanes = project.resource("swimlane").query();
            vm.submit = function () {
                project.resource("task").save(vm.task, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        return addController;
    });
})();