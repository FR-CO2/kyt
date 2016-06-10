var addController = function ($uibModalInstance, project, fieldtypeService) {
    var vm = this;
    vm.fieldTypes = fieldtypeService.query();
    vm.submit = function () {
        project.resource("taskfield").save(vm.taskfield, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project", "fieldtypeService"];
module.exports = addController;