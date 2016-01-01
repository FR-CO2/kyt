(function () {
    define([], function () {
        var addController = function ($uibModalInstance, userRoleService, userService) {
            var vm = this;
            vm.roles = userRoleService.query();
            vm.submit = function () {
                userService.save(vm.user, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    if (error.status === 409) {
                        vm.form.error = "Un utilisateur avec le même nom existe déjà";
                    } else {
                        vm.form.error = "Une erreur inattendue s'est produite!";
                    }
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "userRoleService", "userService"];
        return addController;
    });
})();