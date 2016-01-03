(function () {
    define([], function () {
        var addController = function ($uibModalInstance, userRoleService, userService) {
            var vm = this;
            vm.roles = userRoleService.query();
            vm.submit = function () {
                userService.save(vm.user, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "userRoleService", "userService"];
        return addController;
    });
})();