(function () {
    define(['angular', "dashboard/dashboard.controller",
        "dashboard/calendar/addimputation.controller",
        "uiCalendar", "fullcalendarfr"],
            function (angular, dashboardController, addImputationController) {
                return angular.module('kanban.dashboard', ["ui.calendar"])
                        .controller("dashboardController", dashboardController)
                        .controller("addImputationController", addImputationController);
            });
})();