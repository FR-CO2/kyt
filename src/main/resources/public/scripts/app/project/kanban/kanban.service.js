/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define(["angular"], function (angular) {
        var kanbanService = function ($q, project, taskService) {
            var tasks = [];
            project.$promise.then(function () {
                var statesResource = project.resource("states").query({"order": "position"});
                var swimlanesResource = project.resource("swimlanes").query({"order": "position"});
                $q.all([statesResource.$promise, swimlanesResource.$promise]).then(function (data) {
                    var states = data[0];
                    var swimlanes = data[1];
                    angular.forEach(states, function (state) {
                        tasks.push(state);
                        state.swimlanes = [];
                        angular.forEach(swimlanes, function (swimlane) {
                            state.swimlanes.push(swimlane);
                            swimlane.tasks = taskService.query(
                                    {"projectId": project.id,
                                        "swimlane": swimlane.id,
                                        "state": state.id});
                        });
                        var noswimlane = {};
                        noswimlane.tasks = taskService.query(
                                {"projectId": project.id,
                                    "swimlane": "",
                                    "state": state.id});
                        state.swimlanes.push(noswimlane);
                    });
                });
            });
        };
        kanbanService.$inject = ["$q", "project", "taskService"];
        return kanbanService;
    });
})();
