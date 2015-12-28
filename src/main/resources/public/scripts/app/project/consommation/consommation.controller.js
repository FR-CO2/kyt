(function () {
    define([], function () {
        var consomationController = function (project, consomationService) {
            var vm = this;
            vm.precision = "week";
            vm.start = new Date();
            vm.start.setHours(0);
            vm.start.setMinutes(0);
            vm.start.setMilliseconds(0);
            vm.start.setSeconds(0);
            var end = new Date(vm.start.getTime());
            vm.showDetail = function (entry) {
                entry.showDetails = true;
            };
            vm.hideDetail = function (entry) {
                entry.showDetails = false;
            };
            var loadWeekDays = function (start) {
                var day = new Date(start.getTime());
                //On n'affiche que les jours ouverts
                for (var i = 0; i < 7; i++) {
                    var dayNumber = day.getDate();
                    vm.days.push(day);
                    day = new Date(day.getTime());
                    day.setDate(dayNumber + 1);
                }
            };
            var loadMonthDays = function (start, month) {
                var day = new Date(start.getTime());
                while (day.getMonth() === month) {
                    var dayNumber = day.getDate();
                    //On n'affiche que les jours ouverts
                    vm.days.push(day);
                    day = new Date(day.getTime());
                    day.setDate(dayNumber + 1);
                }
            };
            vm.precisionChange = function () {
                vm.days = [];
                if (vm.precision === "week") {
                    vm.start.setDate(vm.start.getDate() - vm.start.getDay() + 1);
                    loadWeekDays(vm.start);
                    end = new Date(vm.start.getTime());
                    end.setDate(vm.start.getDate() + 7);
                } else {
                    vm.start.setDate(1);
                    loadMonthDays(vm.start, vm.start.getMonth());
                    end = new Date(vm.start.getTime());
                    end.setMonth(vm.start.getMonth() + 1);
                    end.setDate(-1);
                }
                vm.entries = consomationService(project, vm.start, end);
            };
            vm.previous = function () {
                if (vm.precision === "week") {
                    vm.start.setDate(vm.start.getDate() - 7);
                } else {
                    vm.start.setMonth(vm.start.getMonth() - 1);
                }
                vm.precisionChange();
            };
            vm.next = function () {
                if (vm.precision === "week") {
                    vm.start.setDate(vm.start.getDate() + 7);
                } else {
                    vm.start.setMonth(vm.start.getMonth() + 1);
                }
                vm.precisionChange();
            };
            vm.precisionChange();
        };
        consomationController.$inject = ["project", "consomationService"];
        return consomationController;
    });
})();