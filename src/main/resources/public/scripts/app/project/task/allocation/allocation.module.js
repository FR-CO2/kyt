(function () {
    define(['angular', "project/task/allocation/list.controller",
        "project/task/allocation/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.project.task.allocation', [])
                        .controller("allocationListController", listController)
                        .controller("allocationAddController", addController)
            });
})();