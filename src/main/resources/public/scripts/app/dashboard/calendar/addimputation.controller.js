(function () {
    define([], function () {
        var addController = function ($uibModalInstance, day, currentuser) {
            var vm = this;
            vm.day = day;
            vm.userTasks = currentuser.resource("task").query();
            vm.tasks = currentuser.resource("task").query({date: day.format()});
            vm.submit = function () {
                $uibModalInstance.close();
            };
        };
        addController.$inject = ["$uibModalInstance", "day", "currentuser"];
        return addController;
    });
})();