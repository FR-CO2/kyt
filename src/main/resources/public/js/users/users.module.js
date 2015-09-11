(function () {
    "use strict";

    function userImportController($modalInstance, Upload) {
        var vm = this;
        vm.title = "Importer des utilisateurs";
        vm.submit = function() {
            Upload.upload({
                url: '/api/user/import',
                file: vm.file
            }).success(function () {
                    $modalInstance.close();
                }).error(function (e) {
                    vm.form = {error: e};
            });
        };
    }

    function userAddController($modalInstance, userResourceSrv, applicationRoleResourceSrv) {
        var vm = this;
        vm.roles = applicationRoleResourceSrv.query();
        vm.submit = function () {
            userResourceSrv.save(vm.user, function () {
                $modalInstance.close();
            });
        };
    }

    function userResource($resource) {
        return $resource("/api/user/:id", {id: "@id"}, {
            page: {url: "/api/user/page", method: "GET", isArray: false}
        });
    }

    function applicationRoleResource($resource) {
        return $resource("/api/role");
    }

    function userListController($modal, $window, $http, userResourceSrv) {
        var vm = this;
        vm.nbElt = 10;
        vm.numPage = 1;
        vm.paging = {
            size: vm.nbElt,
            page: 0
        };
        vm.users = userResourceSrv.page(vm.paging);
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/users/add.html",
                controller: "userAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.users = userResourceSrv.page(vm.paging);
            });
        };
        vm.delete = function (userId) {
            userResourceSrv.delete({id: userId}, function () {
                vm.users = userResourceSrv.page(vm.paging);
            });
        };
        vm.pageChanged = function () {
            if (vm.nbElt !== vm.paging.size) {
                vm.numPage = 1;
            }
            ;
            vm.paging = {
                size: vm.nbElt,
                page: vm.numPage - 1
            };
            vm.users = userResourceSrv.page(vm.paging, function (result) {
                vm.numPage = result.number + 1;
            });
        };
        vm.export = function () {
            // Creating a Blob with our data for download
            // this will parse the URL in ng-href such as: blob:http...
            $http({method: 'GET',
                url: '/api/user/export',
                headers: {'Content-Type': undefined}})
                    .then(function (response) {
                        var blob = new Blob([response.data], {type: 'text/csv'});
                        saveAs(blob, "export-users.csv");
                    })
        };

        vm.import = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/common/import.html",
                controller: "userImportController",
                controllerAs: "import",
                size: "xs"
            });
            modalInstance.result.then(function () {
                vm.users = userResourceSrv.page(vm.paging);
            });
        };
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
    userResource.$inject = ["$resource"];
    userListController.$inject = ["$modal", "$window", "$http", "userResource"];
    userImportController.$inject = ["$modalInstance", "Upload"];
    userAddController.$inject = ["$modalInstance", "userResource", "applicationRoleResource"];
    applicationRoleResource.$inject = ["$resource"];

    angular.module("kanban.user", ["ngFileUpload"])
            .config(userConfig)
            .controller("userListController", userListController)
            .controller("userAddController", userAddController)
            .controller("userImportController", userImportController)
            .service("userResource", userResource)
            .service("applicationRoleResource", applicationRoleResource);
})();