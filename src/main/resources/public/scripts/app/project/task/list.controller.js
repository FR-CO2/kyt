(function () {
    define(["angular"], function (angular) {
        var taskController = function ($uibModal, project, taskAssemblerService, HateoasInterface) {
            var vm = this;
            var loadPage = function () {
                vm.tasks = project.resource("task").get(
                        {
                            page: vm.tasks.page.number,
                            size: vm.tasks.page.size
                        }, function () {
                    if (vm.tasks._embedded) {
                        angular.forEach(vm.tasks._embedded.taskResourceList, taskAssemblerService);
                    }
                });
            };
            vm.tasks = {
                page: {
                    size: 15,
                    number: 0
                }
            };
            loadPage();
            vm.delete = function (task) {
                new HateoasInterface(task).resource("self").delete(loadPage);
            };
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
                modalInstance.result.then(loadPage);
            };
        };
        taskController.$inject = ["$uibModal", "project", "taskAssemblerService", "HateoasInterface"];
        return taskController;
    });
})();