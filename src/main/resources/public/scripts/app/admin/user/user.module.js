(function () {
    define(['angular', "admin/user/list.controller", "admin/user/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.user', [])
                        .controller("listUserAdminController", listController)
                        .controller("addUserAdminController", addController);
            });
})();