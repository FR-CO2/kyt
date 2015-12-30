(function () {
    define(["angular"], function (angular) {
        var dashboardController = function ($uibModal, HateoasInterface, currentuser, taskAssemblerService, uiCalendarConfig, moment) {
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
                        angular.forEach(data._embedded.taskResourceList, function(task) {
                            task = taskAssemblerService(task);  
                            task.project = new HateoasInterface(task).resource("project").get();
                        });
                    }
                    data.page.number++;
                    return data;
                });
                vm.calendarOptions = {
                    height: 450,
                    editable: false,
                    lang: "fr",
                    header: {
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    },
                    viewRender: function (view, element) {
                        var start = moment(view.start);
                        var end = moment(view.end);
                        vm.loadCalendarEvent(start.format("DD/MM/YYYY"), end.format("DD/MM/YYYY"));
                    },
                    dayClick: dayOnClick
                };
            });
            vm.loadCalendarEvent = function (start, end) {
                currentuser.resource("task").query({start: start, end: end},
                function (data) {
                    angular.forEach(data, function (task) {
                        task = taskAssemblerService(task);
                        task.title = task.name;
                        task.start = moment(task.plannedStart);
                        task.end = moment(task.plannedEnding);
                        task.allDay = true;
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
            dayOnClick = function (day) {
                $uibModal.open({
                    animation: true,
                    templateUrl: "templates/dashboard/calendar/imputation.html",
                    controller: "addImputationController",
                    controllerAs: "addImputationCtrl",
                    resolve: {
                        day: function () {
                            return day;
                        },
                        currentuser: function () {
                            return currentuser;
                        }
                    },
                    size: "md"
                });
            };
            vm.eventsSource = [];
        };
        dashboardController.$inject = ["$uibModal", "HateoasInterface", "currentuser", "taskAssemblerService", "uiCalendarConfig", "moment"];
        return dashboardController;
    });
})();