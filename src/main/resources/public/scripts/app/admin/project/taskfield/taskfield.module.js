var listController = require("./list.controller");
var addController = require("./add.controller");
var fieldtypeSrv = require("./fieldtype.service");
module.exports = angular.module('kanban.admin.project.taskfield', [])
        .service("fieldtypeService", fieldtypeSrv)
        .controller("listTaskfieldAdminController", listController)
        .controller("addTaskfieldAdminController", addController);