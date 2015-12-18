/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define(["angular"], function (angular) {

        var kanbanService = function ($q) {

            var fetchKanbanTask = function (tasks) {
                angular.forEach(tasks, function (task) {
                    task.state = task.resource("state").get();
                    if (task._links.swimlane) {
                        task.swimlane = task.resource("swimlane").get();
                    }
                    if (task._links.assignee) {
                        task.assignee = task.resource("assignee").get();
                    }
                    if (task._links.category) {
                        task.category = task.resource("category").get();
                    }
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
            return {
                load: function (project) {
                    var tasks = [];
                    project.$promise.then(function () {
                        var statesResource = project.resource("state").query({"order": "position"});
                        var swimlanesResource = project.resource("swimlane").query({"order": "position"});
                        $q.all([statesResource.$promise, swimlanesResource.$promise]).then(function (data) {
                            var states = data[0];
                            var swimlanes = data[1];
                            angular.forEach(swimlanes, function (swimlane) {
                                tasks.push(swimlane);
                                swimlane.states = retrieveTaskBySwimlane(project, states, swimlane.id);
                            });
                            var noswimlane = {states: states = retrieveTaskBySwimlane(project, states, null)};
                            tasks.push(noswimlane);
                        });
                    });
                    return tasks;
                }
            };
        };
        kanbanService.$inject = ["$q"];
        return kanbanService;
    });
})();
