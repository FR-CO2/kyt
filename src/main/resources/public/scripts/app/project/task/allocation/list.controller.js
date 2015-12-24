(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
            var currenttask = scope.taskCtrl.task;
            var currentproject = scope.taskCtrl.project;
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/project/task/allocation/add.html",
                    controller: "allocationAddController",
                    controllerAs: "addAllocationCtrl",
                    resolve: {
                        task: function () {
                            return currenttask;
                        }, 
                        project : function() {
                            return currentproject;
                        }
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    currenttask.allocations = currenttask.resource("allocation").query();
                });
            };
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();