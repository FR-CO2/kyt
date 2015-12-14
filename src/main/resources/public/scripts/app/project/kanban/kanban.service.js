/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define(["angular"], function (angular) {
        var kanbanService = function ($q, taskService) {
            return {
                load: function (project) {
                    var tasks = [];
                    project.$promise.then(function () {
                        var statesResource = project.resource("states").query({"order": "position"});
                        var swimlanesResource = project.resource("swimlanes").query({"order": "position"});
                        $q.all([statesResource.$promise, swimlanesResource.$promise]).then(function (data) {
                            var states = data[0];
                            var swimlanes = data[1];
                            angular.forEach(swimlanes, function (swimlane) {
                                tasks.push(swimlane);
                                swimlane.states = [];
                                angular.forEach(states, function (state) {
                                    swimlane.states.push(state);
                                    state.tasks = taskService.query(
                                            {"projectId": project.id,
                                                "swimlane": swimlane.id,
                                                "state": state.id});
                                });
                            });
                            var noswimlane = {states: []};
                            angular.forEach(states, function (state) {
                                noswimlane.states.push(state);
                                state.tasks = taskService.query(
                                        {"projectId": project.id,
                                            "swimlane": "",
                                            "state": state.id});
                            });
                            tasks.push(noswimlane);
                        });
                    });
                    return tasks;
                }
            }
        };
        kanbanService.$inject = ["$q", "taskService"];
        return kanbanService;
    });
})();
