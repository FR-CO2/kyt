        var projectController = function ($state, project, userRights) {
            var vm = this;
            vm.project = project;
            if (!userRights.hasReadRights) {
                $state.transitionTo("app.dashboard");
            }
            vm.rights = userRights;
        };
        projectController.$inject = ["$state", "project", "userRights"];
        module.exports = projectController;