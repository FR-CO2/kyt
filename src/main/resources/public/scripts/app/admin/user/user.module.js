(function () {
    define(['angular', "admin/user/user.config", "admin/user/list.controller",
            "admin/user/add.controller", "admin/user/user.service",
            "admin/user/userrole.service"],
            function (angular, config, listController, addController,
                userService, userRoleService) {
                return angular.module('kanban.admin.user', [])
                        .config(config)
                        .controller("listUserAdminController", listController)
                        .controller("addUserAdminController", addController)
                        .service("userService", userService)
                        .service("userRoleService", userRoleService);
            });
})();