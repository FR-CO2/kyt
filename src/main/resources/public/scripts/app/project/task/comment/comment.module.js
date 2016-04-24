var listController = require("./list.controller");
var addController = require("./add.controller");
var replyController = require("./reply.controller");
module.exports = angular.module('kanban.project.task.comment', [])
        .controller("commentListController", listController)
        .controller("commentAddController", addController)
        .controller("commentReplyController", replyController);