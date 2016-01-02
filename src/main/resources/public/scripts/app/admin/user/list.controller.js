(function () {
    define([], function () {
        var listController = function ($uibModal, HateoasInterface, userService, userRoleService) {
            var vm = this;
            vm.users = {
                page: {
                    number: 0,
                    size: 15
                }
            };
            vm.userRoles = userRoleService.query();
            vm.users = userService.get({page: vm.users.page.number,
                size: vm.users.page.size});
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/user/add.html",
                    controller: "addUserAdminController",
                    controllerAs: "addUserAdminCtrl",
                    size: "md"
                });
                modalInstance.result.then(function () {
                    vm.users = userService.get({page: vm.users.page.number,
                        size: vm.users.page.size});
                });
            };
            vm.delete = function (user) {
                new HateoasInterface(user).resource("self").delete(null, function () {
                    vm.users = userService.get({page: vm.users.page.number,
                        size: vm.users.page.size});
                });
            };
            vm.saveUser = function(user){
                new HateoasInterface(user).resource("self").save(user);
            };
        };
        listController.$inject = ["$uibModal", "HateoasInterface", "userService", "userRoleService"];
        return listController;
    });
})();