(function () {
    define([], function () {
        var consomationController = function (project, consomationTaskService) {
            var vm = this;
            vm.swimlanes = consomationTaskService(project);
        };
        consomationController.$inject = ["project", "consomationTaskService"];
        return consomationController;
    });
})();