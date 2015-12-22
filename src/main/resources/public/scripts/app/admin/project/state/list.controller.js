(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
            vm.stateListSortOptions = {
                orderChanged: function (event) {
                    var stateUpdated = event.source.itemScope.modelValue;
                    var newPosition = event.dest.index;
                    stateUpdated.position = newPosition;
                    stateUpdated.resource("self").save(null, stateUpdated);
                }
            };
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/project/state/add.html",
                    controller: "addStateAdminController",
                    controllerAs: "addStateCtrl",
                    resolve: {
                        project : scope.projectEditCtrl.project
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    var project = scope.projectEditCtrl.project;
                    project.states = project.resource("state").query();
                });
            };
            vm.delete = function (state) {
                state.resource("self").delete(null, function () {
                    var project = scope.projectEditCtrl.project;
                    project.states = project.resource("state").query();
                });
            };
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();