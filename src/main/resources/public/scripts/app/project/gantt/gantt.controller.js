var ganttController = function ($uibModal, project) {
    var vm = this;
    vm.addTask = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/add.html",
            controller: "addTaskController",
            controllerAs: "addTaskCtrl",
            resolve: {
                project: function () {
                    return project;
                }
            },
            size: "md"
        });
        modalInstance.result.then(function () {});
    };

};
ganttController.$inject = ["$uibModal", "project"];
module.exports = ganttController;
