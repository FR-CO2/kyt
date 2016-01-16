(function () {
    define([], function () {
        var editController = function ($state, project) {
            var vm = this;
            vm.project = project;
            $state.transitionTo("app.project.edit.category", {projectId: project.id});
        };
        editController.$inject = ["$state", "project"];
        return editController;
    });
})();


