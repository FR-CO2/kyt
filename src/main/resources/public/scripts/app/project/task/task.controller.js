
var taskController = function ($q, $state, $uibModal, project, currenttask, taskAssemblerService, allocationService, growl, appParameters) {
    var vm = this;
    vm.customFieldMap = {};
    vm.task = currenttask;


    vm.allocation = allocationService.loadAllocation(appParameters);
    project.$promise.then(function () {
        currenttask.$promise.then(function () {
            vm.task = taskAssemblerService(currenttask);
            vm.task.parentId = [];
            vm.task.childrenId = [];

            vm.task.children = vm.task.resource("children").query();
            vm.task.children.$promise.then(function(data){
                for(var i = 0 ; i < data.length; i++){
                    vm.task.childrenId.push(data[i].id);
                }
            });
            vm.task.parent = vm.task.resource("parents").query();
            vm.task.parent.$promise.then(function(data){
                for(var i = 0 ; i < data.length; i++){
                    vm.task.parentId.push(data[i].id);
                }
            });
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
                angular.forEach(data, function (customField) {
                    if (vm.customFieldMap[customField.fieldName].definition.type === "NUMBER") {
                        vm.customFieldMap[customField.fieldName].fieldValue = parseFloat(customField.fieldValue);
                    } else if (vm.customFieldMap[customField.fieldName].definition.type === "DATE") {
                        vm.customFieldMap[customField.fieldName].fieldValue = null;
                        if (customField.fieldValue !== null) {
                            vm.customFieldMap[customField.fieldName].fieldValue = new Date(customField.fieldValue);
                        } else if (vm.customFieldMap[customField.fieldName].definition.required === true) {
                            vm.customFieldMap[customField.fieldName].fieldValue = new Date();
                        }
                    } else {
                        vm.customFieldMap[customField.fieldName].fieldValue = customField.fieldValue;
                    }
                });
            });
        });
    });
    vm.addTask = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/add.html",
            controller: "addTaskController",
            controllerAs: "addTaskCtrl",
            resolve: {
                project: function () {
                    return project;
                }
            },
            size: "md"
        });
        modalInstance.result.then(vm.loadPage);
    };
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
    vm.chechNotAlreadyInParentOrChild = function(task){
        var isNotPresent = true;
        if(vm.task.childrenId.indexOf(task.id) > -1 ||vm.task.parentId.indexOf(task.id) > -1){
            isNotPresent = false;
        }
        return isNotPresent;
    };
    vm.addChild = function ($item, $model, $label) {
        if(vm.chechNotAlreadyInParentOrChild($item)) {
            vm.task.resource("children").query({linkedTaskId: $item.id}, function () {
                vm.task.children.push($item);
                vm.task.childrenId.push($item.id);
            });
        }
        vm.selectedChild = null;
    };
    vm.addParent = function ($item, $model, $label) {
        if(vm.chechNotAlreadyInParentOrChild($item)){
            vm.task.resource("parents").query({linkedTaskId: $item.id}, function () {
                vm.task.parent.push($item);
                vm.task.parentId.push($item.id);
            });
        }
        vm.selectedParent = null;
    };
    vm.removeChild = function (index) {
        vm.task.children.splice(index, 1);
        vm.task.childrenId.splice(index, 1);
    };
    vm.removeParent = function (index) {
        vm.task.parent.splice(index, 1);
        vm.task.parentId.splice(index, 1);
    };
    vm.getTasks = function (term) {
        return project.resource("task").query({idTask : vm.task.id,search: term}).$promise.then(function(data){
            var resultWithoutDuplicate = [];
            for(i = 0; i < data.length; i ++){
                if(vm.chechNotAlreadyInParentOrChild(data[i])){
                    resultWithoutDuplicate.push(data[i]);
                }
            }
            return resultWithoutDuplicate;
        });
    };
    vm.formatLibelle = function(task){
        var libelle = '';
        if(task !== undefined && task !== null){
            libelle = '#'+ task.id + ' - ' + task.name;
        }
        return libelle;
    }
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
taskController.$inject = ["$q", "$state","$uibModal", "project", "task", "taskAssemblerService", "allocationService", "growl", "appParameters"];
module.exports = taskController;
