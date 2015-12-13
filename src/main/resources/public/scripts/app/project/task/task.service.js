/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define([], function () {
        var taskService = function ($resource) {
            return $resource("/api/project/:projectId/task/:taskId");
        };
        taskService.$inject = ["$resource"];
        return taskService;
    });
})();
