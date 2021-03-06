var kanbanService = function ($q, taskAssemblerService) {

    var fetchKanbanTask = function (tasks) {
        angular.forEach(tasks, function (task) {
            task = taskAssemblerService(task);
        });
        return tasks;
    };

    var retrieveTaskBySwimlane = function (project, states, swimlaneId) {
        var result = [];
        var i = 0;
        angular.forEach(states, function (state) {
            result[i] = {id: state.id};
            result[i].tasks = project.resource("task").query(
                    {"swimlane": swimlaneId, "state": state.id},
                    fetchKanbanTask);
            i++;
        });
        return result;
    };

    var retrieveTaskNoSwimlane = function (project, states) {
        var result = [];
        var i = 0;
        angular.forEach(states, function (state) {
            result[i] = {id: state.id};
            result[i].tasks = project.resource("task").query(
                    {"noswimlane": true, "state": state.id},
                    fetchKanbanTask);
            i++;
        });
        return result;
    };

    return {
        load: function (project) {
            var tasks = [];
            project.$promise.then(function () {
                var statesResource = project.resource("state").query({"kanban": true});
                var swimlanesResource = project.resource("swimlane").query();
                $q.all([statesResource.$promise, swimlanesResource.$promise]).then(function (data) {
                    var states = data[0];
                    var swimlanes = data[1];
                    angular.forEach(swimlanes, function (swimlane) {
                        tasks.push(swimlane);
                        swimlane.states = retrieveTaskBySwimlane(project, states, swimlane.id);
                    });
                    var noswimlane = {states: states = retrieveTaskNoSwimlane(project, states)};
                    tasks.push(noswimlane);
                });
            });
            return tasks;
        }
    };
};
kanbanService.$inject = ["$q", "taskAssemblerService"];
module.exports = kanbanService;
