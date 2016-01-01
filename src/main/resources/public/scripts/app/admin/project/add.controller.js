(function () {
    define([], function () {
        var addController = function ($uibModalInstance, projects ) {
            var vm = this;
            vm.submit = function () {
                projects.resource("self").save(vm.project, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    if (error.status === 409) {
                        vm.form.error = "Un projet avec le même nom existe déjà";
                    } else {
                        vm.form.error = "Une erreur inattendue s'est produite!";
                    }
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "projects"];
        return addController;
    });
})();