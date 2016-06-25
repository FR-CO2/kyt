var ganttService = function ($q) {

    var retrieveTaskBySwimlane = function (project, swimlane) {
        swimlane.tasks = [];
        var ganttTasks = project.resource("task").query({swimlane: swimlane.id});
        ganttTasks.$promise.then(function (tasks) {
            angular.forEach(tasks, function (task) {
                swimlane.tasks.push(fetchToGanttTask(task));
            });
        });
    };
    var retrieveTaskNoSwimlane = function (project) {
        var backlog = {name: "backlog", tasks: []};
        var ganttTasks = project.resource("task").query({noswimlane: true});
        ganttTasks.$promise.then(function (tasks) {
            angular.forEach(tasks, function (task) {
                backlog.tasks.push(fetchToGanttTask(task));
            });
        });
        return backlog;

    };

    var fetchToGanttTask = function (task) {
        var plannedStart = moment();
        var plannedEnding = moment();
        if (task.plannedStart) {
            plannedStart = task.plannedStart;
        }
        if (task.plannedStart) {
            plannedEnding = task.plannedEnding;
        }
        return {
            id: task.id,
            name: task.name,
            from: plannedStart,
            to: plannedEnding,
            color: "#0288d1"
        }
    };

    return {
        loadRows: function (project) {
            var data = [];
            data.push(retrieveTaskNoSwimlane(project));
            var swimlanesResource = project.resource("swimlane").query();
            swimlanesResource.$promise.then(function (swimlanes) {
                angular.forEach(swimlanes, function (swimlane) {
                    data.push(swimlane);
                    retrieveTaskBySwimlane(project, swimlane);
                });

            });
            return data;
        }
    };
};
ganttService.$inject = ["$q"];

module.exports = ganttService;
