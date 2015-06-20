(function () {
    "use strict";

    function stateReportController($stateParams, reportsResource) {
        var vm = this;
        vm.stateReport = reportsResource.query({"projectId": $stateParams.id, reportName: "state"});
        vm.swimlane = reportsResource.query({"projectId": $stateParams.id, reportName: "swimlane"});
    }

    function assigneeReportController($stateParams, reportsResource) {
        var vm = this;
        vm.labels = [];
        vm.values = [];
        reportsResource.get({"projectId": $stateParams.id, reportName: "assignee"}, 
            function(result) {
                for (var i in result) {
                    vm.labels.push(result[i][0]);
                    vm.values.push(result[i][1]);
                }
            });
    }


    function reportsResource($resource) {
        return $resource("/api/project/:projectId/report/:reportName",
        {projectId: "@projectId", reportName: "@reportName"},
        {get: {isArray: true}});
    }


    function projectReportsConfig($stateProvider) {
        $stateProvider.state("app.project-detail.report", {
            templateUrl: "templates/projects/reports/report-layout.html",
            url: "/report"
        });
        $stateProvider.state("app.project-detail.report.assignee", {
            templateUrl: "/templates/projects/reports/assignee.html",
            controller: "assigneeReportController",
            controllerAs: "reportAssigneeCtrl",
            url: "/assignee"
        });
        $stateProvider.state("app.project-detail.report.state", {
            templateUrl: "/templates/projects/reports/state-swimlane.html",
            controller: "stateReportController",
            controllerAs: "reportStateCtrl",
            url: "/state"
        });
    }

    projectReportsConfig.$inject = ["$stateProvider"];
    stateReportController.$inject = ["$stateParams", "reportsResource"];
    assigneeReportController.$inject = ["$stateParams", "reportsResource"];
    reportsResource.$inject = ["$resource"];

    angular.module("kanban.project.reports", [])
            .config(projectReportsConfig)
            .controller("stateReportController", stateReportController)
            .controller("assigneeReportController", assigneeReportController)
            .service("reportsResource", reportsResource);

})();

