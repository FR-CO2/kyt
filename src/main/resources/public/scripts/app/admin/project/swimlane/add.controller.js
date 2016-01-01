(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.submit = function () {
                project.resource("swimlane").save(vm.swimlane, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    if (error.status === 409) {
                        vm.form.error = "Un couloir avec le même nom existe déjà pour ce projet";
                    } else {
                        vm.form.error = "Une erreur inattendue s'est produite!";
                    }
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "project"];
        return addController;
    });
})();