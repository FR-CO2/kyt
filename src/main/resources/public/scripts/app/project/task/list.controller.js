(function () {
    define(["angular"], function (angular) {
        var taskController = function (project, taskAssemblerService) {
            var vm = this;
            vm.tasks = {
                page: {
                    size: 15,
                    page: 0
                }
            }
            vm.tasks = project.resource("task").get(vm.tasks.page, function () {
                if (vm.tasks._embedded) {
                    return angular.forEach(vm.tasks._embedded.taskResourceList, taskAssemblerService);
                }
                return vm.tasks;
            });
        };
        taskController.$inject = ["project", "taskAssemblerService"];
        return taskController;
    });
})();