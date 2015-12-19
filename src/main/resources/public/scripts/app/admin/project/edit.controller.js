(function () {
    define([], function () {
        var editController = function (project) {
            var vm = this;
            vm.project = project;
        };
        editController.$inject = ["project"];
        return editController;
    });
})();


