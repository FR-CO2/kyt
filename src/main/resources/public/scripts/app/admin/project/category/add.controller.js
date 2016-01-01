(function () {
    define([], function () {
        var addController = function ($uibModalInstance, project) {
            var vm = this;
            vm.submit = function () {
                project.resource("category").save(vm.category, function () {
                    $uibModalInstance.close();
                }, function (error) {
                    if (error.status === 409) {
                        vm.form.error = "Une catégorie avec le même nom existe déjà pour ce projet";
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