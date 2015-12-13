(function () {
    define(['angular', "dashboard/dashboard.controller"],
            function (angular, dashboardController) {
                return angular.module('kanban.dashboard', [])
                        .controller("dashboardController", dashboardController);
            });
})();