(function () {
    "use strict";

    function historyListController($stateParams) {
        var vm = this;

    }

    function taskHistoryResource($resource) {
        return $resource("/api/project/:projectId/task/:id/history", {projectId: "@projectId", id: "@id"});
    }

    historyListController.$inject = ["$stateParams"];
    taskHistoryResource.$inject = ["$resource"];

    angular.module("kanban.project.task.history", [])
            .controller("historyListController", historyListController)
            .service("taskHistoryResource", taskHistoryResource);
})();