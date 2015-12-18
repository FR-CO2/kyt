(function () {
    define(['angular', "admin/user/user.config", "admin/user/list.controller",
            "admin/user/add.controller", "admin/user/user.service"],
            function (angular, config, listController, addController, userService) {
                return angular.module('kanban.admin.user', [])
                        .config(config)
                        .controller("listUserAdminController", listController)
                        .controller("addUserAdminController", addController)
                        .service("userService", userService);
            });
})();