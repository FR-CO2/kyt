(function () {
    define(['angular', 
        "admin/project/category/list.controller", "admin/project/category/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.project.category', [])
                        .controller("listCategoryAdminController", listController)
                        .controller("addCategoryAdminController", addController);
            });
})();