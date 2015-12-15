(function () {
    define([], function () {
        var kanbanController = function ($modal, project, kanbanService) {
            var vm = this;
            var loadKanban = function () {
                vm.states = project.resource("states").query({"order": "position"});
                vm.swimlanes = kanbanService.load(project);
            }
            project.$promise.then(loadKanban);
            vm.addTask = function () {
                var modalInstance = $modal.open({
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
                modalInstance.result.then(loadKanban);
            };
        };
        kanbanController.$inject = ["$modal", "project", "kanbanService"];
        return kanbanController;
    });
})();