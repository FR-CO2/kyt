(function () {
    define([], function () {
        var addController = function ($uibModalInstance, projects ) {
            var vm = this;
            vm.submit = function () {
                projects.resource("self").save(vm.project, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "projects"];
        return addController;
    });
})();