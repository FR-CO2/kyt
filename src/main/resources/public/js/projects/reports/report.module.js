(function () {
    "use strict";

    function stateReportController($stateParams, $modal, stateResourceSrv) {
        var vm = this;
        vm.states = stateResourceSrv.query({"projectId": $stateParams.id});

    }

    function assigneeReportController($stateParams, $modal, memberResourceSrv) {
        var vm = this;
        vm.members = memberResourceSrv.page({"projectId": $stateParams.id, size: vm.paging.size, page: vm.paging.page});
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
    stateReportController.$inject = ["$stateParams", "$modal", "taskStateResource"];
    assigneeReportController.$inject = ["$stateParams", "$modal", "memberResource"];

    angular.module("kanban.project.reports", [])
            .config(projectReportsConfig)
            .controller("stateReportController", stateReportController)
            .controller("assigneeReportController", assigneeReportController);

})();

