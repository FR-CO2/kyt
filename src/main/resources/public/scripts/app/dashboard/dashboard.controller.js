(function () {
    define(["angular"], function (angular) {
        var dashboardController = function (currentuser, taskAssemblerService, uiCalendarConfig, moment) {
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
            });
            vm.loadCalendarEvent = function (start, end) {
                currentuser.resource("task").query(function (data) {
                    angular.forEach(data, function (task) {
                        task = taskAssemblerService(task);
                        task.title = task.name;
                        task.start = task._start = moment(task.plannedStart);
                        task.end = task._end = moment(task.plannedEnding);
                        if (task._links.category) {
                            task.category.$promise.then(function () {
                                task.backgroundColor = task.category.bgcolor;
                                uiCalendarConfig.calendars.userCalendar.fullCalendar('renderEvent', task);
                            });
                        } else {
                            uiCalendarConfig.calendars.userCalendar.fullCalendar('renderEvent', task);
                        }
                    });
                });
            };

            vm.calendarOptions = {
                height: 450,
                editable: true,
                lang: "fr",
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                viewRender: function (view, element) {
                    vm.loadCalendarEvent(view.start, view.end);
                }
            };
            vm.eventsSource = [];
        };
        dashboardController.$inject = ["currentuser", "taskAssemblerService", "uiCalendarConfig", "moment"];
        return dashboardController;
    });
})();