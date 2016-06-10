
var listController = function ($uibModal, project, moment) {
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
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (swimlane) {
        swimlane.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.saveSwimlane = function (swimlane) {
        var result = swimlane.resource("self").save(swimlane).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.swimlanes = project.resource("swimlane").query();
        vm.swimlanes.$promise.then(function (data) {
            angular.forEach(data, function (swimlane) {
                if (swimlane.endPlanned) {
                    swimlane.endPlanned = moment(swimlane.endPlanned).toDate();
                }
            });
        });
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project", "moment"];
module.exports = listController;
