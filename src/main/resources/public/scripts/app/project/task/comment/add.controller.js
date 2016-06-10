var addController = function ($uibModalInstance, task, comment) {
    var vm = this;
    if (comment.id) {
        vm.parentComment = comment;
    }
    vm.submit = function () {
        if (vm.parentComment) {
            vm.parentComment.resource("reply").save(vm.comment, function () {
                $uibModalInstance.close();
            }, function (error) {
                vm.error = error.data;
            });
        } else {
            task.resource("comment").save(vm.comment, function () {
                $uibModalInstance.close();
            }, function (error) {
                vm.error = error.data;
            });
        }
    };
};
addController.$inject = ["$uibModalInstance", "task", "comment"];
module.exports = addController;

