(function () {
    define(["angular"], function (angular) {

        var consomationTaskService = function ($q) {

            var fetchConsommation = function (data, start, end) {
                var defer = $q.defer();
                var tasks = [];
                angular.forEach(data, function (task) {
                    tasks.push(task);
                    task.allocations = task.resource("allocation").query({"start": start, "end": end});
                });
                return defer.promise;
            };

            return function (project, start, end) {
                var swimlanes = project.resource("swimlane").query({"order": "position"}, function (data) {
                    angular.forEach(data, function (swimlane) {
                        swimlane.tasks = project.resource("task").query(
                                {"swimlane": swimlane.id},
                        function (data) {
                            return fetchConsommation(data, start, end)
                        });
                    });
                });
                var noSwimlane = {
                    name : "-",
                    tasks: project.resource("task").query(
                            {"noswimlane": true},
                    function (data) {
                        return fetchConsommation(data, start, end)
                    })
                };
                swimlanes.$promise.then(function() {
                    swimlanes.push(noSwimlane);
                });
                return swimlanes;
            };
        };
        consomationTaskService.$inject = ["$q"];
        return consomationTaskService;
    });
})();