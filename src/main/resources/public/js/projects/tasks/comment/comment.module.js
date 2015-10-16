(function () {
    "use strict";

    function commentListController($stateParams, $modal, taskCommentResource) {
        var vm = this;
        vm.comments = taskCommentResource.query({projectId: $stateParams.id, taskId: $stateParams.taskId});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/tasks/comment/add.html",
                controller: "newCommentController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.comments = taskCommentResource.query({projectId: $stateParams.id, taskId: $stateParams.taskId});
            });
        };
    }

    function newCommentController($stateParams, taskCommentResource) {
        var vm = this;
        vm.comment = {
            writingDate: new Date()
        };
        vm.submit = function() {
            taskCommentResource.save({projectId: $stateParams.id, taskId: $stateParams.taskId}, vm.comment);
        };
    }

    function taskCommentResource($resource) {
        return $resource("/api/project/:projectId/task/:taskId/comment", {projectId: "@projectId", taskId: "@id"});
    }

    commentListController.$inject = ["$stateParams", "$modal", "taskCommentResource"];
    newCommentController.$inject = ["$stateParams", "taskCommentResource"];
    taskCommentResource.$inject = ["$resource"];

    angular.module("kanban.project.task.comment", [])
            .controller("commentListController", commentListController)
            .controller("newCommentController", newCommentController)
            .service("taskCommentResource", taskCommentResource);
})();