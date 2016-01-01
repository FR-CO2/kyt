(function () {
    define([], function () {
        var listController = function ($uibModal, currenttask, currentproject) {
            var vm = this;
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
                    size: "xd"
                });
                modalInstance.result.then(function () {
                    vm.allocations = currenttask.resource("allocation").query();
                });
            };
            vm.delete = function(allocation){
                allocation.resource("self").delete(null, function () {
                    vm.allocations = currenttask.resource("allocation").query();
                });
            };
            vm.allocations = currenttask.allocations = currenttask.resource("allocation").query();
        };
        listController.$inject = ["$uibModal", "task", "project"];
        return listController;
    });
})();