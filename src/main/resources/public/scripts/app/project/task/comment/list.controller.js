(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
            var currenttask = scope.taskCtrl.task;
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/project/task/comment/add.html",
                    controller: "commentAddController",
                    controllerAs: "addCommentCtrl",
                    resolve: {
                        task: function () {
                            return currenttask;
                        },
                        comment: {}
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    currenttask.comments = currenttask.resource("comment").query();
                });
            };
            vm.reply = function (comment) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/project/task/comment/add.html",
                    controller: "commentAddController",
                    controllerAs: "addCommentCtrl",
                    resolve: {
                        comment: function () {
                            return comment;
                        },
                        task: function () {
                            return currenttask;
                        }
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    currenttask.comments = currenttask.resource("comment").query();
                });
            };
            vm.showReply = function (comment) {
                vm.selectedComment = comment;
            };
            vm.delete = function (comment) {
                comment.resource("self").delete(null, function () {
                    currenttask.comments = currenttask.resource("comment").query();
                });
            }
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();