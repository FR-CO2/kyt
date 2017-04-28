var histoController = function (scope,histoService) {
    var vm = this;
    vm.page = 1;
    vm.size = 10;
    vm.cpt = 0;
    vm.busy = false;
    vm.histosTask = [];
    vm.noMoreHisto = false;

    vm.loadHisto = function () {
        if(!vm.noMoreHisto){ // We check that the last call did not return no result
            if(!vm.busy){ // We check that it does not another calling to server
                vm.busy = true;
                var currenttask = scope.taskCtrl.task;
                currenttask.$promise.then(function () {
                    currenttask.resource("histo").query({page: vm.page, size: vm.size}).$promise.then(function (data) {
                        if(data.length > 0){
                            vm.histosTask.push(data);
                            angular.forEach(data, function (histoTask) {
                                vm.histosTask[vm.cpt] = histoService(histoTask);
                                vm.cpt++;
                            });
                            vm.busy = false;
                        } else { // if the last return has no result, noMoreHisto becomes true
                            vm.noMoreHisto = true;
                        }
                    });
                    vm.page = vm.page + 10;
                    vm.size = vm.size + 10;
                });
            }
        }
    };

    vm.loadHisto();
};
histoController.$inject = ["$scope", "histoService"];
module.exports = histoController;