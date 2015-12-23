(function () {
    define([], function () {
        var addController = function ($uibModalInstance, task) {
            var vm = this;
            vm.submit = function() {
                task.resource("comment").save(vm.comment, function() {
                    $uibModalInstance.close();
                });
            };
        };
        addController.$inject = ["$uibModalInstance", "task"];
        return addController;
    });
})();


