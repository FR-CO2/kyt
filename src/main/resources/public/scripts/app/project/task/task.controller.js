(function () {
    define([], function () {
        var taskController = function (project, task) {
            var vm = this;
            vm.task = task;
            vm.categories = project.resource("category").query();
            vm.states = project.resource("states").query();
            vm.swimlanes = project.resource("swimlanes").query();
            vm.members = project.resource("members").get();
            vm.submit = function() {
                task.resource("self").save(vm.task);
            };
        };
        taskController.$inject = ["project", "task"];
        return taskController;
    });
})();