(function () {
    define(["angular"], function (angular) {
        var taskController = function ($q, $state, project, currenttask, taskAssemblerService) {
            var vm = this;
            vm.customFieldMap = {};
            project.$promise.then(function () {
                currenttask.$promise.then(function () {
                    vm.task = taskAssemblerService(currenttask);
                    $state.transitionTo("app.project.task.comment", {projectId: project.id, taskId: vm.task.id});
                });
                vm.categories = project.resource("category").query();
                vm.states = project.resource("state").query();
                vm.swimlanes = project.resource("swimlane").query();
                var customfields = project.resource("taskfield").query();
                $q.all([customfields.$promise, currenttask.$promise]).then(function (data) {
                    vm.task.customField = [];
                    angular.forEach(data[0], function (customField) {
                        vm.customFieldMap[customField.fieldName] = {
                            definition: customField
                        };
                        vm.task.customField.push(vm.customFieldMap[customField.fieldName]);
                    });
                    vm.task.resource("customfield").query(function (data) {
                        angular.forEach(data[0], function (customField) {
                            vm.customFieldMap[customField.fieldName].fieldValue = customField.fieldValue;
                        });
                    })
                });
            });

            vm.selectAssignee = function ($item, $model, $label) {
                vm.task.assignee = $model;
            };
            vm.getMembers = function (term) {
                return project.resource("member").query({search: term}).$promise;
            };
            vm.submit = function () {
                angular.forEach(vm.task.customField, function (customField) {
                    if (vm.customFieldMap[customField.definition.fieldName].value) {
                        customField.value = vm.customFieldMap[customField.definition.fieldName].value;
                    }
                });
                vm.task.resource("self").save(vm.task, function () {
                    $state.transitionTo("app.project.kanban", {projectId: project.id});
                }, function (error) {
                    vm.error = error.data;
                });
            };
        };
        taskController.$inject = ["$q", "$state", "project", "task", "taskAssemblerService"];
        return taskController;
    });
})();