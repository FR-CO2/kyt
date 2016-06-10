var projectModule = require("./project/project.module");
var userModule = require("./user/user.module");
module.exports = angular.module('kanban.admin',
        [projectModule.name, userModule.name]);
