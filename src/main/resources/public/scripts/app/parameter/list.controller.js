
var listController = function ($uibModal, parameterService) {
    var vm = this;
    vm.saveParameter = function (parameter) {
        var result = parameterService.save(parameter).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.parameters = parameterService.query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "parameterService"];
module.exports = listController;

