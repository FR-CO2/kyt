(function () {
    define(['angular', "dashboard/dashboard.controller", "uiCalendar", "fullcalendarfr"],
            function (angular, dashboardController) {
                return angular.module('kanban.dashboard', ["ui.calendar"])
                        .controller("dashboardController", dashboardController);
            });
})();