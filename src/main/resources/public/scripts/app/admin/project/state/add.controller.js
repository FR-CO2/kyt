(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.submit = function () {
                project.resource("state").save(vm.state, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        return addController;
    });
})();