(function () {
    "use strict";

    function userAddController($modalInstance, userResourceSrv, applicationRoleResourceSrv) {
        var vm = this;
        vm.roles = applicationRoleResourceSrv.query();
        vm.submit = function () {
            userResourceSrv.add(vm.user).then(function (data) {
                $modalInstance.close();
            });
        };
    }

    function userListController($modal, $http, userResourceSrv) {
        var vm = this;
        vm.users = {
            page: {}
        };
        userResourceSrv.page(vm.users.page).then(function (data) {
            vm.users = data;
        });
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/users/add.html",
                controller: "userAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                userResourceSrv.page(vm.users.page).then(function (data) {
                    vm.users = data;
                });
            });
        };
        vm.delete = function (userId) {
            userResourceSrv.delete(userId).then(function () {
                userResourceSrv.page(vm.users.page).then(function (data) {
                    vm.users = data;
                });
            });
        };
        vm.pageChanged = function () {
            userResourceSrv.page(vm.users.page).then(function (data) {
                vm.users = data;
            });
        };
        ;
    }

    function userConfig($stateProvider) {
        $stateProvider.state("app.users", {
            templateUrl: "templates/users/list.html",
            controller: "userListController",
            controllerAs: "userCtrl",
            url: "users"
        });
    }

    userConfig.$inject = ["$stateProvider"];
    userListController.$inject = ["$modal", "$http", "userResourceAssembler"];
    userAddController.$inject = ["$modalInstance", "userResourceAssembler", "applicationRoleResource"];


    angular.module("kanban.user", ["kanban.api", "ngFileUpload"])
            .config(userConfig)
            .controller("userListController", userListController)
            .controller("userAddController", userAddController);
})();