(function () {
    define([], function () {
        var addController = function ($uibModalInstance, userService, project) {
            var vm = this;
            vm.users = userService.query();
            vm.projectRoles = project.resource("roles").query();
            vm.submit = function () {
                project.resource("member").save(vm.member, function () {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "userService", "project"];
        return addController;
    });
})();