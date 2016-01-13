(function () {
    define([], function () {
        var taskController = function ($state, project, currenttask, taskAssemblerService) {
            var vm = this;
            currenttask.$promise.then(function () {
                vm.task = taskAssemblerService(currenttask);
                $state.transitionTo("app.project.task.comment", {projectId: project.id, taskId: vm.task.id});
            });
            project.$promise.then(function () {
                vm.categories = project.resource("category").query();
                vm.states = project.resource("state").query();
                vm.swimlanes = project.resource("swimlane").query();
            });
            vm.selectAssignee = function ($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.getMembers = function(term) {
                return project.resource("member").query({search: term}).$promise;
            };
            vm.submit = function () {
                vm.task.resource("self").save(vm.task, function () {
                    $state.transitionTo("app.project.kanban", {projectId: project.id });
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        taskController.$inject = ["$state", "project", "task", "taskAssemblerService"];
        return taskController;
    });
})();