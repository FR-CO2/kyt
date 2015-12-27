(function () {
    define(["angular"], function (angular) {
        var dashboardController = function (currentuser, taskAssemblerService) {
            var vm = this;
            vm.tasks = {
                page: {
                    size: 10,
                    number: 1
                }
            };
            currentuser.resource("task").get(
                {
                    page: vm.tasks.page.number - 1,
                    size: vm.tasks.page.size
                }, function (data) {
                if (data._embedded) {
                    angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
                }
                data.page.number++;
                vm.tasks = data;
            });
        };
        dashboardController.$inject = ["currentuser", "taskAssemblerService"];
        return dashboardController;
    });
})();