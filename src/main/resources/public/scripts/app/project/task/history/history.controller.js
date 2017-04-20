var histoController = function (scope,histoService) {
    var vm = this;
    var currenttask = scope.taskCtrl.task;
    currenttask.$promise.then(function () {
        //vm.histosTask = currenttask.resource("histo").query();
        currenttask.resource("histo").query().$promise.then(function(data){
            vm.histosTask = data;
            var cpt=0;
            angular.forEach(data, function(histoTask){
                vm.histosTask[cpt] = histoService(histoTask);
                cpt++;
            });
        });
    });
};
histoController.$inject = ["$scope", "histoService"];
module.exports = histoController;