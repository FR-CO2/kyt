(function () {
    define([], function () {
        var listController = function (scope) {
            var vm = this;
            var currentcomment = scope.commentListCtrl.selectedComment;
            vm.replies = currentcomment.resource("reply").query();
        };
        listController.$inject = ["$scope"];
        return listController;
    });
})();