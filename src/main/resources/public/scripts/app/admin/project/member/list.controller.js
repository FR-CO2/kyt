var listController = function ($uibModal, project, HateoasInterface) {
    var vm = this;
    vm.projectRoles = project.resource("roles").query();
    vm.members = {
        page: {
            number: 0,
            size: 15
        }
    };
    vm.members = project.resource("member").get(
            {page: vm.members.page.number,
                size: vm.members.page.size});
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/member/add.html",
            controller: "addMemberAdminController",
            controllerAs: "addMemberCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.members = project.resource("member").get(
                    {page: vm.members.page.number,
                        size: vm.members.page.size});
        });
    };
    vm.delete = function (member) {
        new HateoasInterface(member).resource("self").delete(null, function () {
            vm.members = project.resource("member").get(
                    {page: vm.members.page.number,
                        size: vm.members.page.size});
        });
    };
    vm.saveMember = function (member) {
        var result = new HateoasInterface(member).resource("self").save(member).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
};
listController.$inject = ["$uibModal", "project", "HateoasInterface"];
module.exports = listController;