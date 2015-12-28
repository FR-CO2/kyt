(function () {
    define([], function () {
        var consomationController = function (project, $state) {
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
            vm.start = new Date();
            vm.viewKindChange = function () {
                if (vm.viewKind === "member") {
                    $state.transitionTo("app.project.consommation.member", {projectId: project.id});
                } else {
                    $state.transitionTo("app.project.consommation.task", {projectId: project.id});
                }
            };
            var loadWeekDays = function (start) {
                var day = start;
                //On n'affiche que les jours ouverts
                for (var i = 1; i < 6; i++) {
                    var dayNumber = day.getDate();
                    vm.days.push(day);
                    day = new Date();
                    day.setDate(dayNumber + 1);
                }
            };
            var loadMonthDays = function (start, month) {
                var day = start;
                while (day.getMonth() === month) {
                    var dayNumber = day.getDate();
                    //On n'affiche que les jours ouverts
                    if (day.getDay() > 0 && day.getDay() < 6) {
                        vm.days.push(day);
                    }
                    day = new Date();
                    day.setDate(dayNumber + 1);
                }
            };
            vm.precisionChange = function () {
                vm.days = [];
                vm.start = new Date();
                if (vm.precision === "week") {
                    vm.start.setDate(vm.start.getDate() - vm.start.getDay() + 1);
                    loadWeekDays(vm.start);
                } else {
                    vm.start.setDate(1);
                    var month = vm.start.getMonth();
                    loadMonthDays(vm.start, month);
                }
            };
            vm.precisionChange();
        };
        consomationController.$inject = ["project", "$state"];
        return consomationController;
    });
})();