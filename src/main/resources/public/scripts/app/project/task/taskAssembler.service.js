/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {
        var taskAssemblerService = function (HateoasInterface, moment) {
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
                if (task._links.assignee) {
                    task.assignee = taskresource.resource("assignee").get();
                }

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

                return task;
            };
        };
        taskAssemblerService.$inject = ["HateoasInterface", "moment"];
        return taskAssemblerService;
    });
})();
