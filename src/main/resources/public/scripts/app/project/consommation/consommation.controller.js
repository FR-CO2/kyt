(function () {
    define([], function () {
        var consomationController = function (project, $state) {
            var vm = this;
            vm.showDetail = function (entry) {
                entry.showDetails = true;
            };
            vm.hideDetail = function (entry) {
                entry.showDetails = false;
            };
            if ($state.current.name !== "app.project.consommation.task") {
                vm.viewKind = "member";
                $state.transitionTo("app.project.consommation.member", {projectId: project.id});
            } else {
                vm.viewKind = "task";
            };
            vm.precision = "week";
            vm.viewKindChange = function () {
                if (vm.viewKind === "member") {
                    $state.transitionTo("app.project.consommation.member", {projectId: project.id});
                } else {
                    $state.transitionTo("app.project.consommation.task", {projectId: project.id});
                }
            };
            vm.precisionChange = function () {
                //TODO reload current state
            };
        };
        consomationController.$inject = ["project", "$state"];
        return consomationController;
    });
})();