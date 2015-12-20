(function () {
    define([], function () {
        var listController = function ($uibModal, scope) {
            var vm = this;
            vm.swimlaneListSortOptions = {
                orderChanged: function (event) {
                    var swimlaneUpdated = event.source.itemScope.modelValue;
                    var newPosition = event.dest.index;
                    swimlaneUpdated.position = newPosition;
                    swimlaneUpdated.resource("self").save(null, swimlaneUpdated);
                }
            };
            vm.add = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: "templates/admin/project/swimlane/add.html",
                    controller: "addSwimlaneAdminController",
                    controllerAs: "addSwimlaneCtrl",
                    size: "md"
                });
                modalInstance.result.then(function () {
                    var project = scope.projectEditCtrl.project;
                    project.swimlanes = project.resource("swimlane").query();
                });
            };
            vm.delete = function (swimlane) {
                swimlane.resource("self").delete(null, function () {
                    var project = scope.projectEditCtrl.project;
                    project.swimlanes = project.resource("swimlane").query();
                });
            };
        };
        listController.$inject = ["$uibModal", "$scope"];
        return listController;
    });
})();