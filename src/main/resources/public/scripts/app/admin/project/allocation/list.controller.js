
var listController = function ($uibModal, project) {
    var vm = this;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/allocation/add.html",
            controller: "addAllocationAdminController",
            controllerAs: "addAllocationCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (imputation) {
        imputation.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.saveImputation = function (imputation) {
        var result = imputation.resource("self").save(imputation).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.allocation = project.resource("projectConfig").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project"];
module.exports = listController;

