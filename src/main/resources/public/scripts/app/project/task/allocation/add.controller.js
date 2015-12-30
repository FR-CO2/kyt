(function () {
    define([], function () {
        var addController = function ($uibModalInstance, task, project) {
            var vm = this;
            vm.getMembers = function (term) {
                return project.resource("member").query({search: term}).$promise;
            };
            vm.selectMember = function ($item, $model, $label) {
                vm.allocation.member = $model;
            };
            vm.submit = function () {
                task.resource("allocation").save(vm.allocation, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "task", "project"];
        return addController;
    });
})();