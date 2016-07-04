var taskController = function ($uibModal, project, taskAssemblerService, HateoasInterface) {
    var vm = this;
    vm.filter = {state: "all", swimlane: "all", category: "all", member: "all"};
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
        vm.states = project.resource("state").query();
        vm.swimlanes = project.resource("swimlane").query();
        vm.members = project.resource("member").query();
        vm.categories = project.resource("category").query();
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
    vm.changedFilter = function () {

        var filter = {};
        if (vm.filter.state !== "all") {
            filter.idState = vm.filter.state;
        }

        if (vm.filter.swimlane !== "all") {
            filter.idSwimlane = vm.filter.swimlane;
        }

        if (vm.filter.member !== "all") {
            filter.idAssignee = vm.filter.member;
        }

        if (vm.filter.category !== 'all') {
            filter.idCategory = vm.filter.category;
        }
        
        if(vm.filter.deleted){
            filter.deleted = true;
        }
        project.resource("task").get({idState: filter.idState, idSwimlane : filter.idSwimlane, idAssignee : filter.idAssignee,
            idCategory : filter.idCategory, deleted : filter.deleted, page: vm.tasks.page.number - 1,
                    size: vm.tasks.page.size, sort: vm.sort.field, sortDirection: vm.sort.sortDirection}, function (data) {
            if (data._embedded) {
                angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
            }
            data.page.number++;
            vm.tasks = data;
        });
    };
    vm.resetFilter = function () {
        vm.filter.state = "all";
        vm.filter.swimlane = "all";
        vm.filter.category = "all";
        vm.filter.member = "all";
        vm.changedFilter();
    };
};
taskController.$inject = ["$uibModal", "project", "taskAssemblerService", "HateoasInterface"];
module.exports = taskController;