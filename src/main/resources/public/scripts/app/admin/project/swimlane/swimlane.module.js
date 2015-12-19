(function () {
    define(['angular', 
        "admin/project/swimlane/list.controller", "admin/project/swimlane/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.project.swimlane', [])
                        .controller("listSwimlaneAdminController", listController)
                        .controller("addSwimlaneAdminController", addController);
            });
})();