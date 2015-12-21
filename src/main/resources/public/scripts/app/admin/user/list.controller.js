(function () {
    define([], function () {
        var listController = function ($uibModal, HateoasInterface, userService) {
            var vm = this;
            vm.users = {
                page : {
                    number : 0,
                    size: 15
                }
            };
            vm.users = userService.get({page : vm.users.page.number, 
                                        size : vm.users.page.size});
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/user/add.html",
                    controller: "addUserAdminController",
                    controllerAs: "addUserAdminCtrl",
                    size: "md"
                });
                modalInstance.result.then(function () {
                    vm.users = userService.get({page : vm.users.page.number, 
                                        size : vm.users.page.size});
                });
            };
            vm.delete = function (user) {
                new HateoasInterface(user).resource("self").delete(null, function () {
                    vm.users = userService.get({page : vm.users.page.number, 
                                        size : vm.users.page.size});
                });
            };
        };
        listController.$inject = ["$uibModal", "HateoasInterface", "userService"];
        return listController;
    });
})();