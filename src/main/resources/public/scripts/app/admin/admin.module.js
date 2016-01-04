(function () {
    define(['angular', "admin/project/project.module", "admin/user/user.module"],
            function (angular, projectModule, userModule) {
                return angular.module('kanban.admin',
                                    [projectModule.name, userModule.name]);
            });
})();