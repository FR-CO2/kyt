(function () {
    define([], function () {
        var addController = function ($uibModalInstance, day, currentuser) {
            var vm = this;
            vm.day = day;
            vm.imputations = currentuser.resource("consommation").query({date: day.format("DD/MM/YYYY")});
            vm.addTask = function ($item, $model, $label) {
                var imputation = {
                    taskName: $model.name,
                    taskId: $model.id,
                    timeRemains: $model.timeRemains,
                    timeSpent: 0
                };
                vm.imputations.push(imputation);
                vm.addedTask = null;
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