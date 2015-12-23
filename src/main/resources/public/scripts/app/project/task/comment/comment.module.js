(function () {
    define(['angular', "project/task/comment/list.controller",
        "project/task/comment/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.project.task.comment', [])
                        .controller("commentListController", listController)
                        .controller("commentAddController", addController);
            });
})();