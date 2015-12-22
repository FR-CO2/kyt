(function () {
    define([], function () {
        var taskController = function (scope, project, currenttask, taskAssemblerService) {
            var vm = this;
            currenttask.$promise.then(function() {
                vm.task = taskAssemblerService(currenttask);
            });
            vm.categories = project.resource("category").query();
            vm.states = project.resource("state").query();
            vm.swimlanes = project.resource("swimlane").query();
            vm.members = project.resource("member").query();
            vm.selectAssignee = function($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.submit = function() {
                vm.task.resource("self").save(vm.task);
            };
        };
        taskController.$inject = ["$scope", "project", "task", "taskAssemblerService"];
        return taskController;
    });
})();