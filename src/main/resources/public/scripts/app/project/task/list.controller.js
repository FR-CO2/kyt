(function () {
    define(["angular"], function (angular) {
        var taskController = function (project, taskAssemblerService) {
            var vm = this;
            vm.tasks = project.resource("task", "page").get(function() {
                return angular.forEach(vm.tasks._embedded.taskResourceList, taskAssemblerService);
            });
        };
        taskController.$inject = ["project", "taskAssemblerService"];
        return taskController;
    });
})();