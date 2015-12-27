(function () {
    define([], function () {
        var taskController = function (project, currenttask, taskAssemblerService, dateFilter) {
            var vm = this;
            currenttask.$promise.then(function () {
                vm.task = taskAssemblerService(currenttask);
                vm.task.plannedEndingValue = setTimeToValue(currenttask.plannedEnding);
                vm.task.plannedStartValue = setTimeToValue(currenttask.plannedStart);
                vm.task.comments = currenttask.resource("comment").query();
                vm.task.allocations = currenttask.resource("allocation").query();
            });
            project.$promise.then(function () {
                vm.project = project;
                vm.categories = project.resource("category").query();
                vm.states = project.resource("state").query();
                vm.swimlanes = project.resource("swimlane").query();
                vm.members = project.resource("member").query();
            });
            vm.selectAssignee = function ($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.submit = function () {
                vm.task.plannedStart = setTimeIfTimeNoChange(vm.task.plannedStartValue, vm.task.plannedStart);
                vm.task.plannedEnding = setTimeIfTimeNoChange(vm.task.plannedEndingValue, vm.task.plannedEnding);
                vm.task.resource("self").save(vm.task, function () {
                    history.back();
                });
            };
            
            var setTimeToValue = function(timeAngular){
                var timeToReturn = null;
                if(timeAngular !== null){
                    timeToReturn = (dateFilter(new Date(timeAngular), 'yyyy-MM-dd'));
                }
                return timeToReturn;
            };
            
            var setTimeIfTimeNoChange = function(timeValue, timeAngular){
                if(timeAngular === null){
                   timeAngular = timeValue;
                }
                return timeAngular;
            };
        };
        taskController.$inject = ["project", "task", "taskAssemblerService", "dateFilter"];
        return taskController;
    });
})();