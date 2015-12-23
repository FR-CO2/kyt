(function () {
    define([], function () {
        var listController = function (scope) {
            var vm = this;
            var currentcomment = scope.commentListCtrl.selectedComment;
            vm.replies = currentcomment.resource("reply").query();
            vm.showReply = function (comment) {
                vm.selectedComment = comment;
            };
        };
        listController.$inject = ["$scope"];
        return listController;
    });
})();