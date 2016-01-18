(function () {
    define([], function () {
        var fieldTypeService = function ($resource) {
            var vm = this;
            vm.selectUser = function ($item, $model, $label) {
                vm.member.user = $model;
            };
            vm.getUsers = function(term) {
                return userService.query({search: term}).$promise;
            };
            vm.projectRoles = project.resource("roles").query();
            vm.submit = function () {
                project.resource("member").save(vm.member, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        fieldTypeService.$inject = ["$resource"];
        return fieldTypeService;
    });
})();