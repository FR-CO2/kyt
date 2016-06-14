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
        
        var stateIdChecked = 0;
        if (vm.filter.state !== "all") {
            stateIdChecked = vm.filter.state;
        }

        var swimlaneIdChecked = 0;
        if (vm.filter.swimlane !== "all") {
            swimlaneIdChecked = vm.filter.swimlane;
        }

        var assigneeIdChecked = 0;
        if (vm.filter.member !== "all") {
            assigneeIdChecked = vm.filter.member;
        }

        var categoryIdChecked = 0;
        if (vm.filter.category !== 'all') {
            categoryIdChecked = vm.filter.category;
        }
        var tasks = [];
        project.resource("task").get({"state": stateIdChecked, "swimlane": swimlaneIdChecked,
            "assignee": assigneeIdChecked, 'category': categoryIdChecked, page: vm.tasks.page.number - 1,
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