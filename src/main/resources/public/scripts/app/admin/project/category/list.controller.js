        var listController = function ($uibModal, project) {
            var vm = this;
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/project/category/add.html",
                    controller: "addCategoryAdminController",
                    controllerAs: "addCategoryCtrl",
                    resolve: {
                        project: project
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
                vm.categories = project.resource("category").query();
            };
            vm.reload();
        };
        listController.$inject = ["$uibModal", "project"];
        module.exports = listController;