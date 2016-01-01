(function () {
    define([], function () {
        var listController = function ($uibModal, scope, HateoasInterface) {
            var vm = this;
            vm.projectRoles = scope.projectEditCtrl.project.resource("roles").query();
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/project/member/add.html",
                    controller: "addMemberAdminController",
                    controllerAs: "addMemberCtrl",
                    resolve: {
                        project: scope.projectEditCtrl.project
                    },
                    size: "md"
                });
                modalInstance.result.then(function () {
                    var project = scope.projectEditCtrl.project;
                    project.members = project.resource("member").get(
                            {page: project.members.page.number,
                                size: project.members.page.size});
                });
            };
            vm.delete = function (member) {
                new HateoasInterface(member).resource("self").delete(null, function () {
                    var project = scope.projectEditCtrl.project;
                    project.members = project.resource("member").get(
                            {page: project.members.page.number,
                                size: project.members.page.size});
                });
            };
            vm.saveMember = function (member) {
                new HateoasInterface(member).resource("self").save(member);
            };
        };
        listController.$inject = ["$uibModal", "$scope", "HateoasInterface"];
        return listController;
    });
})();