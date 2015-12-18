(function () {
    define(['angular', "project/project.module", "admin/project/project.config",
        "admin/project/list.controller", "admin/project/add.controller"],
            function (angular, projectModule, config, listController, addController) {
                return angular.module('kanban.admin.project', [projectModule.name])
                        .config(config)
                        .controller("listProjectAdminController", listController)
                        .controller("addProjectAdminController", addController);
            });
})();