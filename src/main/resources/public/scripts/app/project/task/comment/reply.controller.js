(function () {
    define([], function () {
        var listController = function (scope) {
            var vm = this;
            var currentcomment = scope.commentListCtrl.selectedComment;
            currentcomment.$promise.then(function(data){
                vm.replies = data;
            });
        };
        listController.$inject = ["$scope"];
        return listController;
    });
})();