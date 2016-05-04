var addController = function ($uibModalInstance, day, currentuser, appParameters) {
    var vm = this;
    vm.day = day;
    vm.allocations = {};
    for(var i = 0; i < appParameters.length; i++){
        if(appParameters[i].category === 'ALLOCATION'){
            for(var j = 0; j < appParameters[i].parameter.length; j ++){
                vm.allocations[appParameters[i].parameter[j].keyParam] = appParameters[i].parameter[j].valueParam;
            }
            break;
        };
    }
    // need to multipy by 1000 for get UNIX Timestamp
    vm.imputations = currentuser.resource("consommation").query({date: day.format("X") * 1000});
    vm.addTask = function ($item, $model, $label) {
        var newImputation = {
            taskName: $model.name,
            taskId: $model.id,
            timeRemains: $model.timeRemains,
            timeSpent: 0
        };
        var taskAlreadyAdded = false;
        angular.forEach(vm.imputations, function (imputation) {
            if (newImputation.taskId === imputation.taskId) {
                taskAlreadyAdded = true;
            }
        });
        if (!taskAlreadyAdded) {
            vm.imputations.push(newImputation);
        }
        vm.addedTask = null;
    };
    vm.getTasks = function (term) {
        return currentuser.resource("task").query({search: term}).$promise;
    };
    vm.submit = function () {
        // need to multipy by 1000 for get UNIX Timestamp
        currentuser.resource("consommation").save({date: day.format("X") * 1000}, vm.imputations, function () {
            $uibModalInstance.close();
        });
    };
};
addController.$inject = ["$uibModalInstance", "day", "currentuser", "appParameters"];
module.exports = addController;