var stateModule = require("./state/state.module");
var categoryModule = require("./category/category.module");
var swimlaneModule = require("./swimlane/swimlane.module");
var memberModule = require("./member/member.module");
var taskfieldModule = require("./taskfield/taskfield.module");
var config = require("./project.config");
var listController = require("./list.controller");
var addController = require("./add.controller");
var editController = require("./edit.controller");
module.exports = angular.module('kanban.admin.project',
        ["kanban.project", stateModule.name, categoryModule.name,
            swimlaneModule.name, memberModule.name, taskfieldModule.name])
        .config(config)
        .controller("listProjectAdminController", listController)
        .controller("addProjectAdminController", addController)
        .controller("editProjectAdminController", editController);