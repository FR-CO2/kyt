(function () {
    define([], function () {
        var addController = function ($modalInstance, project) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.members = project.resource("member").get();
            vm.submit = function () {
                project.resource("task","create").save(null, vm.task, function () {
                    $modalInstance.close();
                });
            };
        };
        addController.$inject = ["$modalInstance", "project"];
        return addController;
    });
})();