(function () {
    "use strict";

    function commentListController($stateParams) {
        var vm = this;

    }

    function taskCommentResource($resource) {
        return $resource("/api/project/:projectId/task/:id/comment", {projectId: "@projectId", id: "@id"});
    }

    commentListController.$inject = ["$stateParams"];
    taskCommentResource.$inject = ["$resource"];

    angular.module("kanban.project.task.comment", [])
            .controller("commentListController", commentListController)
            .service("taskCommentResource", taskCommentResource);
})();