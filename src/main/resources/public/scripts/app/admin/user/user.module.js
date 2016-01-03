(function () {
    define(['angular', "admin/user/user.config", "admin/user/list.controller",
            "admin/user/add.controller", "admin/user/user.service",
            "admin/user/userrole.service", "admin/user/samePassword.directive"],
            function (angular, config, listController, addController,
                userService, userRoleService, samePasswordDirective) {
                return angular.module('kanban.admin.user', [])
                        .config(config)
                        .controller("listUserAdminController", listController)
                        .controller("addUserAdminController", addController)
                        .service("userService", userService)
                        .service("userRoleService", userRoleService)
                        .directive("samePassword", samePasswordDirective);
            });
})();