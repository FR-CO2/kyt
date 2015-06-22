(function () {
    "use strict";

    function projectCalendarController($stateParams, eventsResourceSrv) {

    }

    function eventsResource($resource) {
        return $resource("/api/project/:projectId/event/:id", {projectId: "@projectId", id: "@id"}, {
            user: {url: "/api/userEvent", method: "GET", params : {endAfter : "@endAfter"}, isArray: true}
        });
    }

    projectCalendarController.$inject = ["$stateParams", "eventsResource"];
    eventsResource.$inject = ["$resource"];

    angular.module("kanban.calendar", ["kanban.project.task"])
            .controller("projectCalendarController", projectCalendarController)
            .service("eventsResource", eventsResource);
})();