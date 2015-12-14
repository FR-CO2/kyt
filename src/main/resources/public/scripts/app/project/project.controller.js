(function () {
    define([], function () {
        var projectController = function (project, userRights) {
            var vm = this;
            vm.project = project;
            vm.rights = userRights;
        };
        projectController.$inject = ["project", "userRights"];
        return projectController;
    });
})();