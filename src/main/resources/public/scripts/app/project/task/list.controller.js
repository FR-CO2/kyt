(function () {
    define(["angular"], function (angular) {
        var taskController = function ($uibModal, project, taskAssemblerService) {
            var vm = this;
            vm.tasks = project.resource("task", "page").get(function () {
                return angular.forEach(vm.tasks._embedded.taskResourceList, taskAssemblerService);
            });
            vm.addTask = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/project/task/add.html",
                    controller: "addTaskController",
                    controllerAs: "addTaskCtrl",
                    resolve: {
                        project: function () {
                            return project;
                        }
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    vm.tasks = project.resource("task", "page").get(function () {
                        return angular.forEach(vm.tasks._embedded.taskResourceList, taskAssemblerService);
                    });
                });
            };
        };
        taskController.$inject = ["$uibModal", "project", "taskAssemblerService"];
        return taskController;
    });
})();