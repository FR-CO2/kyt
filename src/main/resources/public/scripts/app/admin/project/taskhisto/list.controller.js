var listController = function (project) {
    var vm = this;
    vm.reload = function () {
        vm.taskshisto = project.resource("task").query();
    };
    vm.reload();
};
listController.$inject = ["project"];
module.exports = listController;