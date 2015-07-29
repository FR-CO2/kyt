(function () {

    function timesheetController(taskResource, dateTS) {
        var vm = this;
        vm.dateTS = dateTS;
        vm.tasks = taskResource.userDay({day: dateTS.getTime()});
        vm.loadOthersUserTask = function() {
            vm.othersTask = taskResource.user();
        };
        
        vm.addTask =function(task){
            console.log("test");
            vm.tasks.push(task);
        };
        vm.assignation = {};
    }

    timesheetController.$inject = ["taskResource", "dateTS"];
    
    angular.module("kaban.timesheet", [])
            .controller("timesheetController", timesheetController);
})();