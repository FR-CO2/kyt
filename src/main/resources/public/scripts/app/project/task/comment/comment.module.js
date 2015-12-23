(function () {
    define(['angular', "project/task/comment/list.controller",
        "project/task/comment/add.controller",
        "project/task/comment/reply.controller"],
            function (angular, listController, addController, replyController) {
                return angular.module('kanban.project.task.comment', [])
                        .controller("commentListController", listController)
                        .controller("commentAddController", addController)
                        .controller("commentReplyController", replyController);
            });
})();