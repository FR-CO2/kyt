var histoController = function (scope,histoService) {
    var vm = this;
    vm.page = 1;
    vm.size = 10;

    vm.loadHisto = function () {
        var currenttask = scope.taskCtrl.task;
        currenttask.$promise.then(function () {
            currenttask.resource("histo").query({page: vm.page, size: vm.size}).$promise.then(function (data) {
                vm.histosTask = data;
                var cpt = 0;
                angular.forEach(data, function (histoTask) {
                    vm.histosTask[cpt] = histoService(histoTask);
                    cpt++;
                });
            });
        });
    };

    vm.loadHisto();
};
histoController.$inject = ["$scope", "histoService"];
module.exports = histoController;