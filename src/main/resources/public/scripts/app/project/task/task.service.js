var taskService = function ($resource) {
    return $resource("/api/project/:projectId/task/:taskId", {projectId: "@projectId", id: "@taskId"});
};
taskService.$inject = ["$resource"];
module.exports = taskService;