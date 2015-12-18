(function () {
    define([], function () {
        var listController = function ($uibModal, HateoasInterface, userService) {
            var vm = this;
            vm.users = userService.get();
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/user/add.html",
                    controller: "addUserAdminController",
                    controllerAs: "addUserAdminCtrl",
                    size: "md"
                });
                modalInstance.result.then(function () {
                    vm.users = userService.get();
                });
            };
            vm.delete = function (user) {
                new HateoasInterface(user).resource("self").delete(null, function () {
                    vm.users = userService.get();
                });
            };
        };
        listController.$inject = ["$uibModal", "HateoasInterface", "userService"];
        return listController;
    });
})();