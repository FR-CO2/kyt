(function () {
    define(['angular', 
        "admin/project/member/list.controller", "admin/project/member/add.controller"],
            function (angular, listController, addController) {
                return angular.module('kanban.admin.project.member', [])
                        .controller("listMemberAdminController", listController)
                        .controller("addMemberAdminController", addController);
            });
})();