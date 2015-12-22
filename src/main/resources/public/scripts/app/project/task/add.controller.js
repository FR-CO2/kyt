(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.members = project.resource("member").query();
            vm.submit = function () {
                project.resource("task").save(vm.task, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        return addController;
    });
})();