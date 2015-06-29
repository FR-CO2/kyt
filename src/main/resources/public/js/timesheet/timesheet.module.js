(function () {

    function timesheetController(taskResource, dateTS) {
        var vm = this;
        vm.dateTS = dateTS;
        vm.tasks = taskResource.userDay({day: dateTS.getTime()});
        vm.assignation = {};
    }

    timesheetController.$inject = ["taskResource", "dateTS"];
    
    angular.module("kaban.timesheet", [])
            .controller("timesheetController", timesheetController);
})();