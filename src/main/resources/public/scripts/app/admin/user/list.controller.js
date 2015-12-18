(function () {
    define([], function () {
        var listController = function (userService) {
            var vm = this;
            vm.users = userService.get();
        };
        listController.$inject = ["userService"];
        return listController;
    });
})();