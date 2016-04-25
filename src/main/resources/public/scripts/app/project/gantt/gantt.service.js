var ganttService = function () {

    var retrieveTaskBySwimlane = function (project, swimlaneId) {
        return  project.resource("task").query({swimlane: swimlaneId});
    };
    var retrieveTaskNoSwimlane = function (project) {
        return project.resource("task").query({noswimlane: true});
    };


    return {
        loadRows: function (project) {
            var data = retrieveTaskNoSwimlane(project);
            var swimlanesResource = project.resource("swimlane").query();
            swimlanesResource.$promise.then(function (swimlanes) {
                angular.forEach(swimlanes, function (swimlane) {
                    data.push(swimlane);
                    swimlane.tasks = retrieveTaskBySwimlane(project, swimlane.id);
                });

            });
            return data;
        }
    }
}
module.exports = ganttService;
