(function () {
    define([], function () {
        var editController = function (project) {
            var vm = this;
            vm.project = project;
            project.$promise.then(function () {
                vm.project.categories = project.resource("category").query();
                vm.project.states = project.resource("state").query();
                vm.project.swimlanes = project.resource("swimlane").query();
                vm.project.members = project.resource("member").get();
            });
        };
        editController.$inject = ["project"];
        return editController;
    });
})();


