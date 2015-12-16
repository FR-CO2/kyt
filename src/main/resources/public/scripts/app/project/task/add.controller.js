(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.members = project.resource("member").get();
            vm.submit = function () {
                project.resource("task","create").save(null, vm.task, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        return addController;
    });
})();