(function () {
    define([], function () {
        var kanbanController = function ($uibModal, project, kanbanService) {
            var vm = this;
            var loadKanban = function () {
                vm.states = project.resource("state").query({"order": "position"});
                vm.swimlanes = kanbanService.load(project);
            };
            project.$promise.then(loadKanban);
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
                modalInstance.result.then(loadKanban);
            };
            vm.kanbanSortOptions = {
                itemMoved: function (event) {
                    var task = event.source.itemScope.modelValue;
                    task.state.id = event.dest.sortableScope.element.attr("data-columnindex");
                    var swimlaneId = event.dest.sortableScope.element.attr("data-rowindex");
                    if (swimlaneId) {
                        if (!task.swimlane) {
                            task.swimlane = {};
                        }
                        task.swimlane.id = event.dest.sortableScope.element.attr("data-rowindex");
                    } else {
                        task.swimlane = null;
                    }
                    task.resource("self").save(null, task, function () {
                        vm.states = project.resource("state").query({"order": "position"});
                    });
                }
            };
            vm.loadMember = function(){
                vm.members = project.resource("member").query();
            };
            vm.saveTask = function(task){
                task.resource("self").save(null, task, null);
            };
            vm.loadCategory = function () {
                vm.categories = project.resource("category").query();
            };
        };
        kanbanController.$inject = ["$uibModal", "project", "kanbanService"];
        return kanbanController;
    });
})();