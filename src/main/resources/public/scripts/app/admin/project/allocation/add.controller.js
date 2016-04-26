
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.submit = function () {
                project.resource("imputation").save(vm.imputation, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        module.exports = addController;
