(function () {
    define(["angular"], function (angular) {
        var addController = function ($uibModalInstance, day, currentuser) {
            var vm = this;
            vm.day = day;
            vm.imputations = currentuser.resource("consommation").query({date: day.format("DD/MM/YYYY")});
            vm.addTask = function ($item, $model, $label) {
                var newImputation = {
                    taskName: $model.name,
                    taskId: $model.id,
                    timeRemains: $model.timeRemains,
                    timeSpent: 0
                };
                var taskAlreadyAdded = false;
                angular.forEach(vm.imputations, function(imputation) {
                    if (newImputation.taskId === imputation.taskId) {
                        taskAlreadyAdded = true;
                    }
                });
                if (!taskAlreadyAdded) {
                    vm.imputations.push(newImputation);
                }
                vm.addedTask = null;
            };
            vm.getTasks = function (term) {
                return currentuser.resource("task").query({search: term}).$promise;
            };
            vm.submit = function () {
                currentuser.resource("consommation").save({date: day.format("DD/MM/YYYY")}, vm.imputations, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "day", "currentuser"];
        return addController;
    });
})();