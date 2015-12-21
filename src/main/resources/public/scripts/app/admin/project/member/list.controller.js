(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
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
                        {page : project.members.page.number,
                        size : project.members.page.size});
                });
            };
            vm.delete = function (member) {
                member.resource("self").delete(null, function () {
                    var project = scope.projectEditCtrl.project;
                    project.members = project.resource("member").get(
                        {page : project.members.page.number,
                        size : project.members.page.size});
                });
            };
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();