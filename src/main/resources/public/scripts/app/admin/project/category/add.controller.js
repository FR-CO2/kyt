var addController = function ($uibModalInstance, project) {
    var vm = this;
    vm.submit = function () {
        project.resource("category").save(vm.category, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project"];
module.exports = addController;