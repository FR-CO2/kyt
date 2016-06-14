var kanbanController = function ($uibModal, project, kanbanService, currentuser) {
    var vm = this;
    
    vm.filtre = {swimlane :{id : 'all'}, assignee : false};
    
    var loadKanban = function () {
        vm.states = project.resource("state").query({"kanban": true});
        vm.swimlanes = kanbanService.load(project);
        vm.swimlanesToFiltre = vm.swimlanes;
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
    
    vm.changedFiltre = function(){
        vm.swimlanes = kanbanService.filtre(project, vm.filtre.swimlane.id, vm.filtre.assignee, currentuser);
    };
    
    vm.resetFiltre = function(){
        vm.filtre.swimlane.id = "all";
        vm.filtre.assignee = false;
        vm.changedFiltre();
    };
};
kanbanController.$inject = ["$uibModal", "project", "kanbanService", "currentuser"];
module.exports = kanbanController;
