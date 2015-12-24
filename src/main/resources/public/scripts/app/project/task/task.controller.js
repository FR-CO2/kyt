(function () {
    define([], function () {
        var taskController = function (project, currenttask, taskAssemblerService) {
            var vm = this;
            currenttask.$promise.then(function () {
                vm.task = taskAssemblerService(currenttask);
                vm.task.comments = currenttask.resource("comment").query();
                vm.task.allocations = currenttask.resource("allocation").query();
            });
            project.$promise.then(function () {
                vm.categories = project.resource("category").query();
                vm.states = project.resource("state").query();
                vm.swimlanes = project.resource("swimlane").query();
                vm.members = project.resource("member").query();
            });
            vm.selectAssignee = function ($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.submit = function () {
                vm.task.resource("self").save(vm.task, function () {
                    history.back();
                });
            };
        };
        taskController.$inject = ["project", "task", "taskAssemblerService"];
        return taskController;
    });
})();