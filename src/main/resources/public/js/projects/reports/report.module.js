(function () {
    "use strict";

    function stateReportController($stateParams, reportsResource) {
        var vm = this;
        vm.stateLabels = [];
        vm.stateValues = [new Array()];
        vm.stateSeries = ["Tâches"];
        reportsResource.get({"projectId": $stateParams.id, reportName: "state"},
        function (result) {
            for (var i = 0; i < result.length; i++) {
                vm.stateLabels.push(result[i][0]);
                vm.stateValues[0].push(result[i][1]);
            }
        });
    }

    function swimlaneReportController($stateParams, reportsResource) {
        var vm = this;
        vm.swimlaneLabels = [];
        vm.swimlaneValues = [new Array()];
        vm.swimlaneSeries = [];
        reportsResource.get({"projectId": $stateParams.id, reportName: "swimlane"},
        function (result) {
            for (var i = 0; i < result.length; i++) {
                if (vm.swimlaneLabels.indexOf(result[i][0]) === -1) {
                    vm.swimlaneLabels.push(result[i][0]);
                }
                if (vm.swimlaneSeries.indexOf(result[i][1]) === -1) {
                    vm.swimlaneSeries.push(result[i][1]);
                    vm.swimlaneValues[vm.swimlaneSeries.indexOf(result[i][1])] = new Array();
                }
                var serieIndex = vm.swimlaneSeries.indexOf(result[i][1]);
                vm.swimlaneValues[serieIndex].push(result[i][2]);
            }
        });
    }

    function assigneeReportController($stateParams, reportsResource) {
        var vm = this;
        vm.labels = [];
        vm.values = [];
        reportsResource.get({"projectId": $stateParams.id, reportName: "assignee"},
        function (result) {
            for (var i = 0; i < result.length; i++) {
                vm.labels.push(result[i][0]);
                vm.values.push(result[i][1]);
            }
        });
    }

    function categoryReportController($stateParams, reportsResource) {
        var vm = this;
        vm.labels = [];
        vm.values = [];
        reportsResource.get({"projectId": $stateParams.id, reportName: "category"},
        function (result) {
            for (var i = 0; i < result.length; i++) {
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
            templateUrl: "/templates/projects/reports/state.html",
            controller: "stateReportController",
            controllerAs: "reportStateCtrl",
            url: "/state"
        });
        $stateProvider.state("app.project-detail.report.category", {
            templateUrl: "/templates/projects/reports/category.html",
            controller: "categoryReportController",
            controllerAs: "reportCategoryCtrl",
            url: "/category"
        });
        $stateProvider.state("app.project-detail.report.swimlane", {
            templateUrl: "/templates/projects/reports/swimlane.html",
            controller: "swimlaneReportController",
            controllerAs: "reportSwimlaneCtrl",
            url: "/swimlane"
        });
    }

    projectReportsConfig.$inject = ["$stateProvider"];
    stateReportController.$inject = ["$stateParams", "reportsResource"];
    assigneeReportController.$inject = ["$stateParams", "reportsResource"];
    categoryReportController.$inject = ["$stateParams", "reportsResource"];
    swimlaneReportController.$inject = ["$stateParams", "reportsResource"];
    reportsResource.$inject = ["$resource"];

    angular.module("kanban.project.reports", [])
            .config(projectReportsConfig)
            .controller("stateReportController", stateReportController)
            .controller("assigneeReportController", assigneeReportController)
            .controller("categoryReportController", categoryReportController)
            .controller("swimlaneReportController", swimlaneReportController)
            .service("reportsResource", reportsResource);

})();

