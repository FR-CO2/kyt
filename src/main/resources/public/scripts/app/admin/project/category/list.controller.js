(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/project/category/add.html",
                    controller: "addCategoryAdminController",
                    controllerAs: "addCategoryCtrl",
                    resolve: {
                        project: scope.projectEditCtrl.project
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    vm.reload();
                });
            };
            vm.delete = function (category) {
                category.resource("self").delete(null, function () {
                    vm.reload();
                });
            };
            vm.saveCategory = function (category) {
                var result = category.resource("self").save(category).$promise;
                result.catch(function (error) {
                    error.data = error.data.message;
                });
                return result;
            };
            vm.reload = function () {
                var project = scope.projectEditCtrl.project;
                project.categories = project.resource("category").query();
            };
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();