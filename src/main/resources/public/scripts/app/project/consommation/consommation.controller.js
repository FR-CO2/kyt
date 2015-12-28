(function () {
    define([], function () {
        var consomationController = function (project, $state, consommationFilterFactory) {
            var vm = this;
            vm.showDetail = function (entry) {
                entry.showDetails = true;
            };
            vm.hideDetail = function (entry) {
                entry.showDetails = false;
            };
            if ($state.current.name !== "app.project.consommation.task") {
                vm.viewKind = "member";
                $state.transitionTo("app.project.consommation.member", {projectId: project.id});
            } else {
                vm.viewKind = "task";
            }
            vm.precision = "week";
            vm.viewKindChange = function () {
                if (vm.viewKind === "member") {
                    $state.transitionTo("app.project.consommation.member", {projectId: project.id});
                } else {
                    $state.transitionTo("app.project.consommation.task", {projectId: project.id});
                }
            };
            var loadWeekDays = function (start) {
                var day = new Date(start.getTime());
                //On n'affiche que les jours ouverts
                for (var i = 1; i < 6; i++) {
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
                    if (day.getDay() > 0 && day.getDay() < 6) {
                        vm.days.push(day);
                    }
                    day = new Date(day.getTime());
                    day.setDate(dayNumber + 1);
                }
            };
            vm.precisionChange = function () {
                vm.days = [];
                var start = consommationFilterFactory.filter.start;
                if (vm.precision === "week") {
                    start.setDate(start.getDate() - start.getDay() + 1);
                    consommationFilterFactory.filter.end = new Date(start.getTime());
                    loadWeekDays(consommationFilterFactory.filter.start);
                    consommationFilterFactory.filter.end.setDate(start.getDate() + 7);
                } else {
                    start.setDate(1);
                    var month = start.getMonth();
                    loadMonthDays(consommationFilterFactory.filter.start, month);
                    consommationFilterFactory.filter.end = new Date(start.getTime());
                    consommationFilterFactory.filter.end.setMonth(start.getMonth() + 1);
                    consommationFilterFactory.filter.end.setDate(-1);
                }
            };
            vm.precisionChange();
        };
        consomationController.$inject = ["project", "$state", "consommationFilterFactory"];
        return consomationController;
    });
})();