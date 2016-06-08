var taskController = function ($uibModal, project, taskAssemblerService, HateoasInterface) {
    var vm = this;
    vm.loadPage = function () {
        project.resource("task").get(
                {
                    page: vm.tasks.page.number - 1,
                    size: vm.tasks.page.size,
                    sort: vm.sort.field,
                    sortDirection: vm.sort.sortDirection
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
    vm.sort = {
        field: "name",
        sortDirection: "desc"
    };
    vm.loadPage();
    vm.delete = function (task) {
        new HateoasInterface(task).resource("self").delete(vm.loadPage);
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
        modalInstance.result.then(vm.loadPage);
    };
    vm.tableFilter = function (predicate) {
        if (vm.sort.field !== predicate) {
            vm.sort.sortDirection = "";
        }
        vm.sort.sortDirection = vm.sort.sortDirection === "desc" ? "asc" : "desc";
        vm.sort.field = predicate;
        vm.loadPage();
    };
};
taskController.$inject = ["$uibModal", "project", "taskAssemblerService", "HateoasInterface"];
module.exports = taskController;