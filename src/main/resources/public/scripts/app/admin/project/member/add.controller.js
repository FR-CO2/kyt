(function () {
    define([], function () {
        var addController = function ($uibModalInstance, userService, project) {
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
                    if (error.status === 409) {
                        vm.form = {
                            error : "Des droits pour cet utilisateur existe déjà pour ce projet"
                        };
                    } else {
                        vm.form = {
                            error : "Une erreur inattendue s'est produite!"
                        };
                    }
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "userService", "project"];
        return addController;
    });
})();