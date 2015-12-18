(function () {
    define(["angular"], function (angular) {
        var listController = function (projectService, HateoasInterface) {
            var vm = this;
            vm.projects = {
                page: {
                    number: 0,
                    size: 15
                }
            };
            vm.projects = projectService.get({page: vm.projects.page.number, size : vm.projects.page.size }, function() {
                if (vm.projects._embedded) {
                        angular.forEach(vm.projects._embedded.projectResourceList, function(project) {
                            project.states = new HateoasInterface(project).resource("state").query();
                            return project;
                        });
                }
            });
        };
        listController.$inject = ["projectService", "HateoasInterface"];
        return listController;
    });
})();