<<<<<<< HEAD
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
=======
(function () {

    function timesheetController(taskResource, dateTS) {
        var vm = this;
        vm.dateTS = dateTS;
        vm.tasks = taskResource.userDay({day: dateTS.getTime()});
        vm.assignation = {};
        vm.submit = function() {
            var keys = Object.keys(vm.assignation);
            var assignationSum = 0;
            for (var i = 0; i < keys.length; i++) {
                assignationSum += vm.assignation[keys[i]].timespend;
            }
            if (assignationSum > 10) {
                vm.formError = "Les temps saisis sur une journée ne peut excéder 10";
            }
        };
    }

    timesheetController.$inject = ["taskResource", "dateTS"];
    
    angular.module("kaban.timesheet", [])
            .controller("timesheetController", timesheetController);
>>>>>>> bae95e8b93e4712f86fd2c154b1b46dd32927f4a
})();