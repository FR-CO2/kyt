
var taskController = function ($q, $state, project, currenttask, taskAssemblerService, growl) {
    var vm = this;
    vm.customFieldMap = {};
    vm.task = currenttask;
    //vm.task.description;
    project.$promise.then(function () {
        currenttask.$promise.then(function () {
            vm.task = taskAssemblerService(currenttask);
        });
        vm.categories = project.resource("category").query();
        vm.states = project.resource("state").query();
        vm.swimlanes = project.resource("swimlane").query();
        vm.allocation = project.resource("step").get();
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
                angular.forEach(data, function (customField) {
                    vm.customFieldMap[customField.fieldName].fieldValue = customField.fieldValue;
                });
            });
        });
    });
    vm.selectAssignee = function ($item, $model, $label) {
        var userAlreadyAssigned = false;
        angular.forEach(vm.task.assignees, function (user) {
            if (user.id === $model.id) {
                userAlreadyAssigned = true;
                growl.error("Utilisateur déjà assigné");
            }
        });
        if (!userAlreadyAssigned) {
            vm.task.assignees.push($model);
        }
    };
    vm.removeuser = function (index) {
        vm.task.assignees.splice(index, 1);
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
taskController.$inject = ["$q", "$state", "project", "task", "taskAssemblerService", "growl"];
module.exports = taskController;
