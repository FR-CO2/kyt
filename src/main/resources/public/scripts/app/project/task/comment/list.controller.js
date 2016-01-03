(function () {
    define([], function () {
        var listController = function ($uibModal, currenttask) {
            var vm = this;
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
                    vm.comments = currenttask.resource("comment").query();
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
                    comment.showComment = true;
                    vm.selectedComment = comment.resource("reply").query();
                });
            };
            vm.showHideReply = function (comment) {
                if (comment.showComment) {
                    comment.showComment = false;
                } else {
                    vm.selectedComment = comment.resource("reply").query();
                    comment.showComment = true;
                }
            };
            vm.delete = function (parentComment, comment) {
                comment.resource("self").delete(null, function () {
                    if (parentComment !== null) {
                        vm.selectedComment = parentComment.resource("reply").query();
                    } else {
                        vm.comments = currenttask.resource("comment").query();
                        if (vm.selectedComment === comment) {
                            vm.selectedComment = null;
                        }
                    }
                });
            };
            vm.comments = currenttask.resource("comment").query();
        };
        listController.$inject = ["$uibModal", "task"];
        return listController;
    });
})();