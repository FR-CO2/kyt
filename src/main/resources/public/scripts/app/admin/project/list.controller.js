var listController = function ($uibModal, scope, projectService, HateoasInterface) {
    var vm = this;
    function loadPage() {
        return projectService.get({page: vm.projects.page.number, size: vm.projects.page.size}, function () {
            if (vm.projects._embedded) {
                angular.forEach(vm.projects._embedded.projectResourceList, function (project) {
                    project.states = new HateoasInterface(project).resource("state").query();
                    return project;
                });
            }
        });
    }
    vm.projects = {
        page: {
            number: 0,
            size: 15
        }
    };
    vm.projects = loadPage();
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/add.html",
            controller: "addProjectAdminController",
            controllerAs: "addProjectCtrl",
            resolve: {
                projects: vm.projects
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            scope.$emit("kanban:projects-updates");
            vm.projects = loadPage();
        });
    };
    vm.delete = function (project) {
        new HateoasInterface(project).resource("self").delete(function () {
            scope.$emit("kanban:projects-updates");
            vm.projects = loadPage();
        });
    };
};
listController.$inject = ["$uibModal", "$scope", "projectService", "HateoasInterface"];
module.exports = listController;