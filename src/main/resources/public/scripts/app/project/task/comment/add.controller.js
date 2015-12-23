(function () {
    define([], function () {
        var addController = function ($uibModalInstance, task, comment) {
            var vm = this;
            if (comment) {
                vm.parentComment = comment;
            }
            vm.submit = function () {
                if (vm.parentComment) {
                    vm.parentComment.resource("reply").save(vm.comment, function () {
                        $uibModalInstance.close();
                    });
                } else {
                    task.resource("comment").save(vm.comment, function () {
                        $uibModalInstance.close();
                    });
                }
            };
        };
        addController.$inject = ["$uibModalInstance", "task", "comment"];
        return addController;
    });
})();


