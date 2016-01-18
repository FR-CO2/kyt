(function () {
    define(['angular', 
        "admin/project/taskfield/list.controller", "admin/project/taskfield/add.controller",
        "admin/project/taskfield/fieldtype.service"],
            function (angular, listController, addController, fieldtypeSrv) {
                return angular.module('kanban.admin.project.taskfield', [])
                        .service("fieldtypeService", fieldtypeSrv)
                        .controller("listTaskfieldAdminController", listController)
                        .controller("addTaskfieldAdminController", addController);
            });
})();