(function () {
    define([], function () {
        var taskController = function (project, task) {
            var vm = this;
            vm.task = task;
            vm.categories = project.resource("category").query();
            vm.states = project.resource("state").query();
            vm.swimlanes = project.resource("swimlane").query();
            vm.members = project.resource("member").get();
            vm.submit = function() {
                task.resource("self").save(vm.task);
            };
        };
        taskController.$inject = ["project", "task"];
        return taskController;
    });
})();