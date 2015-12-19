(function () {
    define(['angular', "project/project.module",
        "admin/project/state/state.module",
        "admin/project/category/category.module", 
        "admin/project/swimlane/swimlane.module",
        "admin/project/member/member.module", 
        "admin/project/project.config",
        "admin/project/list.controller", "admin/project/add.controller",
        "admin/project/edit.controller"],
            function (angular, projectModule, stateModule, categoryModule,
            swimlaneModule, memberModule, config, listController,
                addController, editController) {
                return angular.module('kanban.admin.project',
                    [projectModule.name, stateModule.name, categoryModule.name,
                    swimlaneModule.name, memberModule.name])
                        .config(config)
                        .controller("listProjectAdminController", listController)
                        .controller("addProjectAdminController", addController)
                        .controller("editProjectAdminController", editController);
            });
})();