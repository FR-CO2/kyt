(function () {
    define(['angular', 
        "admin/project/state/list.controller", "admin/project/state/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.project.state', ['angular-growl'])
                        .controller("listStateAdminController", listController)
                        .controller("addStateAdminController", addController);
            });
})();