
function timesheetSynthese($stateParams, allocationResource) {
    var vm = this;
    vm.allocations = allocationResource.query({"projectId": $stateParams.id, "taskId": $stateParams.taskId});
}


function allocationResource($resource) {
    return $resource("/api/project/:projectId/task/:taskId/allocation", {projectId: "@projectId"}, {
    });
}

timesheetSynthese.$inject = ["$stateParams", "allocationResource"];
allocationResource.$inject = ["$resource"];

angular.module("kanban.project.task.timesheet", [])
        .controller("timesheetSynthese", timesheetSynthese)
        .service("allocationResource", allocationResource);
