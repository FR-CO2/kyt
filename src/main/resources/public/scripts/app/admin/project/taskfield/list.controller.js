var listController = function ($uibModal, project) {
    var vm = this;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/taskfield/add.html",
            controller: "addTaskfieldAdminController",
            controllerAs: "addTaskfieldCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (taskfield) {
        taskfield.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.reload = function () {
        vm.taskfields = project.resource("taskfield").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project"];
module.exports = listController;