        var listController = function (scope) {
            var vm = this;
            scope.$watch("commentListCtrl.selectedComment", function (newVal, oldVal) {
                var currentcomment = newVal;
                currentcomment.$promise.then(function (data) {
                    vm.replies = data;
                });
            });
        };
        listController.$inject = ["$scope"];
        module.exports = listController;
