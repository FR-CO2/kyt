(function () {
    "use strict";

    function userImportController($modalInstance, $http) {
        var vm = this;

        vm.submit = function () {
            var formData = new FormData();
            formData.append("importuser", vm.fileInput);
            $http({
                method: 'POST',
                url: '/api/user/import',
                headers: {'Content-Type': undefined},
                data: formData
            }).success(function() {
                $modalInstance.close();
            }).error(function(e) {
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

    function userListController($modal, userResourceSrv) {
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
            window.open("api/user/export", '_blank', '');
        };
        vm.import = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/users/import.html",
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

    function fileread($q) {
        var slice = Array.prototype.slice;

        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel)
                    return;

                ngModel.$render = function () {
                };

                element.bind('change', function (e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                            .then(function (values) {
                                if (element.multiple)
                                    ngModel.$setViewValue(values);
                                else
                                    ngModel.$setViewValue(values.length ? values[0] : null);
                            });

                    function readFile(file) {
                        var deferred = $q.defer();

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            deferred.resolve(e.target.result);
                        };
                        reader.onerror = function (e) {
                            deferred.reject(e);
                        };
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
        }; //return
    }

    userConfig.$inject = ["$stateProvider"];
    userResource.$inject = ["$resource"];
    userListController.$inject = ["$modal", "userResource"];
    userImportController.$inject = ["$modalInstance", "$http"];
    userAddController.$inject = ["$modalInstance", "userResource", "applicationRoleResource"];
    applicationRoleResource.$inject = ["$resource"];
    fileread.$inject = ["$q"];
    angular.module("kanban.user", [])
            .config(userConfig)
            .controller("userListController", userListController)
            .controller("userAddController", userAddController)
            .controller("userImportController", userImportController)
            .service("userResource", userResource)
            .service("applicationRoleResource", applicationRoleResource)
            .directive("fileread", fileread);
})();