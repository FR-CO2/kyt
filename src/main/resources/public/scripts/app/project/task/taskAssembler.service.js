var taskAssemblerService = function ($http, HateoasInterface, moment) {
    return function (task) {
        var taskresource = task;
        if (!task.resource) {
            taskresource = new HateoasInterface(task);
        }
        task.state = taskresource.resource("state").get();
        if (task._links.category) {
            task.category = taskresource.resource("category").get();
        }
        if (task._links.swimlane) {
            task.swimlane = taskresource.resource("swimlane").get();
        }
        task.assignees = taskresource.resource("assignee").query(function (assignees) {
            angular.forEach(assignees, function (assignee) {
                if (assignee._links.photo) {
                    $http.get(assignee._links.photo).then(function (result) {
                        assignee.photo = result.data;
                    });
                }
                $http.get(assignee._links.user).then(function (result) {
                    assignee.userId = result.data.id;
                });
            });
            return assignees;
        });
        task.exceededLoad = (task.timeRemains + task.timeSpent > task.estimatedLoad);
        if (taskresource.plannedEnding !== null) {
            var today = moment();
            task.plannedEnding = moment(taskresource.plannedEnding).toDate();
            task.state.$promise.then(function () {
                task.exceededDate = (today.isAfter(task.plannedEnding, 'day') && !task.state.closeState);
            });
        }
        if (taskresource.plannedStart !== null) {
            task.plannedStart = moment(taskresource.plannedStart).toDate();
        }
        task.children = taskresource.resource("children").get();
        return task;
    };
};
taskAssemblerService.$inject = ["$http", "HateoasInterface", "moment"];
module.exports = taskAssemblerService;