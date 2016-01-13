(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.selectAssignee = function ($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.getMembers = function (term) {
                return project.resource("member").query({search: term}).$promise;
            };
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