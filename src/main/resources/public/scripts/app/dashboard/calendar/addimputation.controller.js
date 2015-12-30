(function () {
    define([], function () {
        var addController = function ($uibModalInstance, day, currentuser) {
            var vm = this;
            vm.day = day;
            vm.tasks = currentuser.resource("consommation").query({date: day.format("DD/MM/YYYY")},
                        function (data) {
                            vm.userTasks = currentuser.resource("task").query(function() {
                                //TODO retirer les tâches déjà présentes dans la liste
                            });
                            return data;
                        });
            vm.addTask = function ($item, $model, $label) {
                vm.tasks.push($model);
                vm.addedTask = null;
            };
            vm.submit = function () {
                $uibModalInstance.close();
            };
        };
        addController.$inject = ["$uibModalInstance", "day", "currentuser"];
        return addController;
    });
})();