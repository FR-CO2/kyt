(function () {
    define(["angular"], function (angular) {
        var taskController = function ($uibModal, project, taskAssemblerService, HateoasInterface) {
            var vm = this;
            vm.loadPage = function () {
                project.resource("task").get(
                        {
                            page: vm.tasks.page.number - 1,
                            size: vm.tasks.page.size
                        }, function (data) {
                    if (data._embedded) {
                        angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
                    }
                    data.page.number++;
                    vm.tasks = data;
                });
            };
            vm.tasks = {
                page: {
                    size: 10,
                    number: 1
                }
            };
            vm.loadPage();
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
            vm.tableFilter = function (predicate) {
                vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
                vm.predicate = predicate;
            };
        };
        taskController.$inject = ["$uibModal", "project", "taskAssemblerService", "HateoasInterface"];
        return taskController;
    });
})();