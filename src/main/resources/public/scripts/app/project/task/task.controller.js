(function () {
    define([], function () {
        var taskController = function (task) {
            var vm = this;
            vm.task = task;
        };
        taskController.$inject = ["task"];
        return taskController;
    });
})();