function getWeekDays(moment, start) {
    var days = [];
    var day = moment(start);
    //On n'affiche que les jours ouverts
    for (var i = 0; i < 7; i++) {
        days.push(day);
        day = moment(day).add(1, 'days');
    }
    return days;
}

function getMonthDays(moment, start, month) {
    var days = [];
    var day = moment(start);
    while (day.month() === month) {
        //On n'affiche que les jours ouverts
        days.push(day);
        day = moment(day).add(1, 'days');
    }
    return days;
}

var consomationController = function (moment, project, consomationService, allocationService, appParameters) {
    var vm = this;
    vm.precision = "week";
    vm.start = moment().startOf('isoWeek');
    vm.allocations = {};
    var end = moment(vm.start);
    vm.showDetail = function (entry) {
        entry.showDetails = true;
    };
    vm.hideDetail = function (entry) {
        entry.showDetails = false;
    };
    vm.precisionChange = function () {
        vm.days = [];
        if (vm.precision === "week") {
            vm.start = vm.start.startOf('isoWeek');
            vm.days = getWeekDays(moment, vm.start);
            end = moment(vm.start).add(8, 'days');
            vm.entries = consomationService.loadConsommations(project, vm.start, end);
            vm.entries.$promise.then(function () {
                consomationService.checkMissingByDay(vm.entries, appParameters);
            });
        } else {
            vm.start = vm.start.startOf('month');
            vm.days = getMonthDays(moment, vm.start, vm.start.month());
            end = moment(vm.start).add(1, 'months');
            vm.entries = consomationService.loadConsommations(project, vm.start, end);
            //TODO Regroupe par semaine vm.days et vm.entries
            vm.entries.$promise.then(function () {
                var grouped = consomationService.groupByWeek(vm.entries, vm.days)
                vm.entries = grouped.entries;
                vm.days = grouped.weeks;
            });
        }
    };
    vm.previous = function () {
        if (vm.precision === "week") {
            vm.start = vm.start.subtract(7, "days");
        } else {
            vm.start = vm.start.subtract(1, "months");
        }
        vm.precisionChange();
    };
    vm.next = function () {
        if (vm.precision === "week") {
            vm.start = vm.start.add(7, "days");
        } else {
            vm.start = vm.start.add(1, "months");
        }
        vm.precisionChange();
    };
    vm.checkAllocation = function (allocation) {
        return allocation === vm.max.value;
    };
    vm.precisionChange();
};
consomationController.$inject = ["moment", "project", "consomationService", "allocationService", "appParameters"];
module.exports = consomationController;