(function () {
    define(['angular', "admin/project/list.controller", "admin/project/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.project', [])
                        .controller("listProjectAdminController", listController)
                        .controller("addProjectAdminController", addController);
            });
})();