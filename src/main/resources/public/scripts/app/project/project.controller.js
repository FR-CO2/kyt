(function () {
    define([], function () {
        var projectController = function (userRights) {
            var vm = this;
            vm.rights = userRights;
        };
        projectController.$inject = ["userRights"];
        return projectController;
    });
})();