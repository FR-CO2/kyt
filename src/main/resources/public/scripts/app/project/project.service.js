var projectService = function ($resource) {
    return $resource("/api/project/:projectId");
};
projectService.$inject = ["$resource"];
module.exports = projectService;