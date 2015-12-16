(function () {
    define([], function () {
        var kanbanController = function ($modal, project, kanbanService) {
            var vm = this;
            var loadKanban = function () {
                vm.states = project.resource("state").query({"order": "position"});
                vm.swimlanes = kanbanService.load(project);
            };
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
            vm.kanbanSortOptions = {
                itemMoved: function (event) {
                    var task = event.source.itemScope.modelValue;
                    task.swimlaneId = event.dest.sortableScope.element.attr("data-rowindex");
                    task.stateId = event.dest.sortableScope.element.attr("data-columnindex");
                    task.resource("self").save(null, task, function() {
                        vm.states = project.resource("state").query({"order": "position"});
                    });
                }
            };
        };
        kanbanController.$inject = ["$modal", "project", "kanbanService"];
        return kanbanController;
    });
})();