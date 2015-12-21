(function () {
    define([], function () {
        var editController = function (project) {
            var vm = this;
            vm.project = project;
            project.$promise.then(function () {
                vm.project.categories = project.resource("category").query();
                vm.project.states = project.resource("state").query();
                vm.project.swimlanes = project.resource("swimlane").query();
                vm.project.members = {
                    page : {
                        number : 0,
                        size : 15
                    }
                };
                vm.project.members = project.resource("member").get(
                        {page : vm.project.members.page.number,
                        size : vm.project.members.page.size});
            });
        };
        editController.$inject = ["project"];
        return editController;
    });
})();


