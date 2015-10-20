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
        vm.update = function(taskComment) {
            taskCommentResource.save({projectId: $stateParams.id, taskId: $stateParams.taskId, id: taskComment.id}, taskComment.comment);
        };
        vm.delete = function(id) {
            taskCommentResource.delete({projectId: $stateParams.id, taskId: $stateParams.taskId, id: id}, function () {
                vm.comments = taskCommentResource.query({projectId: $stateParams.id, taskId: $stateParams.taskId});
            });
        };
    }

    function newCommentController($modalInstance, $stateParams, taskCommentResource) {
        var vm = this;
        vm.submit = function() {
            taskCommentResource.save({projectId: $stateParams.id, taskId: $stateParams.taskId}, vm.comment, function () {
                $modalInstance.close();
            });
        };
    }

    function taskCommentResource($resource) {
        return $resource("/api/project/:projectId/task/:taskId/comment/:id", {projectId: "@projectId", taskId: "@id", id: "@id"});
    }

    commentListController.$inject = ["$stateParams", "$modal", "taskCommentResource"];
    newCommentController.$inject = ["$modalInstance", "$stateParams", "taskCommentResource"];
    taskCommentResource.$inject = ["$resource"];

    angular.module("kanban.project.task.comment", [])
            .controller("commentListController", commentListController)
            .controller("newCommentController", newCommentController)
            .service("taskCommentResource", taskCommentResource);
})();