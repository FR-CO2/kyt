/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {
        var taskAssemblerService = function (HateoasInterface) {
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
                if (task._links.backup) {
                    task.backup = taskresource.resource("backup").get();
                } 
                return task;
            };
        };
        taskAssemblerService.$inject = ["HateoasInterface"];
        return taskAssemblerService;
    });
})();
