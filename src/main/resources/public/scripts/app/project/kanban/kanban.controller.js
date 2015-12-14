(function () {
    define([], function () {
        var kanbanController = function (project, kanbanService) {
            var vm = this;
            project.$promise.then(function () {
                vm.states = project.resource("states").query({"order": "position"});
                vm.swimlanes = kanbanService.load(project);
            });
        };
        kanbanController.$inject = ["project", "kanbanService"];
        return kanbanController;
    });
})();