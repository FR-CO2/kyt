(function () {
    define([], function () {
        var addController = function ($modalInstance, project, taskService) {
            var vm = this;
            vm.categories = project.resource("category").query();
            vm.members = project.resource("members").get();
            vm.submit = function () {
                taskService.save({"projectId": project.id}, vm.task, function () {
                    $modalInstance.close();
                });
            };
        };
        addController.$inject = ["$modalInstance", "project", "taskService"];
        return addController;
    });
})();