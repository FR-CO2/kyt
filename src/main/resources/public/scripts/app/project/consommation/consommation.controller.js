(function () {
    define([], function () {
        function getStartDate() {
            var start = new Date();
            start.setHours(0);
            start.setMinutes(0);
            start.setMilliseconds(0);
            start.setSeconds(0);
            return start;
        }

        function getWeekDays(start) {
            var days = [];
            var day = new Date(start.getTime());
            //On n'affiche que les jours ouverts
            for (var i = 0; i < 7; i++) {
                var dayNumber = day.getDate();
                days.push(day);
                day = new Date(day.getTime());
                day.setDate(dayNumber + 1);
            }
            return days;
        }

        function getMonthDays(start, month) {
            var days = [];
            var day = new Date(start.getTime());
            while (day.getMonth() === month) {
                var dayNumber = day.getDate();
                //On n'affiche que les jours ouverts
                days.push(day);
                day = new Date(day.getTime());
                day.setDate(dayNumber + 1);
            }
            return days;
        }

        var consomationController = function (project, consomationService) {
            var vm = this;
            vm.precision = "week";
            vm.start = getStartDate();
            var end = new Date(vm.start.getTime());
            vm.showDetail = function (entry) {
                entry.showDetails = true;
            };
            vm.hideDetail = function (entry) {
                entry.showDetails = false;
            };
            vm.precisionChange = function () {
                vm.days = [];
                if (vm.precision === "week") {
                    vm.start.setDate(vm.start.getDate() - vm.start.getDay() + 1);
                    vm.days = getWeekDays(vm.start);
                    end = new Date(vm.start.getTime());
                    end.setDate(vm.start.getDate() + 7);
                    vm.entries = consomationService.loadConsommations(project, vm.start, end);
                } else {
                    vm.start.setDate(1);
                    vm.days = getMonthDays(vm.start, vm.start.getMonth());
                    end = new Date(vm.start.getTime());
                    end.setMonth(vm.start.getMonth() + 1);
                    vm.entries = consomationService.loadConsommations(project, vm.start, end);
                    //TODO Regroupe par semaine vm.days et vm.entries
                    vm.entries.$promise.then(function() {
                        var grouped = consomationService.groupByWeek(vm.entries, vm.days) 
                        vm.entries = grouped.entries;
                        vm.days = grouped.weeks;
                    });
                }
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