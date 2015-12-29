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
            currentuser.$promise.then(function () {
                vm.tasks = currentuser.resource("task").get(
                        {
                            page: vm.tasks.page.number - 1,
                            size: vm.tasks.page.size
                        }, function (data) {
                    if (data._embedded) {
                        angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
                    }
                    data.page.number++;
                    return data;
                });
                var events = currentuser.resource("task").query(function (data) {
                    angular.forEach(data, function (task) {
                        task = taskAssemblerService(task);
                        task.title = task.name;
                        task.start = new Date(task.plannedStart);
                        task.end = new Date(task.plannedEnding);
                        if (task._links.category) {
                            task.backgroundColor = task.category.bgcolor;
                        }
                        ;
                    });
                    return data;
                });
                events.$promise.then(function () {
                    vm.eventsSource.push(events);
                });
            });
            vm.calendarOptions = {
                calendar: {
                    height: 450,
                    editable: true,
                    lang: "fr",
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    }
                }
            };
            vm.eventsSource = [];
        };
        dashboardController.$inject = ["currentuser", "taskAssemblerService"];
        return dashboardController;
    });
})();