var listController = function ($uibModal, project, growl) {
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
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (state) {
        state.resource("self").delete(null, function () {
            vm.reload();
        }, function (error) {
            growl.error(error.data.message);
        });
    };
    vm.saveState = function (state) {
        var result = state.resource("self").save(state).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.states = project.resource("state").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project", "growl"];
module.exports = listController;