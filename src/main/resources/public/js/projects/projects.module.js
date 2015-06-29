(function () {
    "use strict";

    function kanbanLoader(vm, taskStateResource, swimlaneResource, taskResource, projectId) {
        vm.tasks = [];
        taskStateResource.kanban({projectId: projectId}, function (states) {
            vm.nbState = states.length;
            vm.states = states;
            vm.swimlanes = swimlaneResource.query({projectId: projectId}, function (swimlanes) {
                var defaultSwimlanePos = swimlanes.length;
                for (var i = 0; i < states.length; i++) {
                    vm.tasks[states[i].position] = new Array();
                    for (var j = 0; j < swimlanes.length; j++) {
                        vm.tasks[states[i].position][swimlanes[j]] = new Array();
                    }
                    vm.tasks[states[i].position][defaultSwimlanePos] = new Array();
                }
                vm.swimlanes[defaultSwimlanePos] = {name: "", position: defaultSwimlanePos};
                taskResource.kanban({projectId: projectId}, function (tasks) {
                    for (var i = 0; i < tasks.length; i++) {
                        var task = tasks[i];
                        var lanePos = defaultSwimlanePos;
                        if (task.swimlane) {
                            lanePos = task.swimlane.position;
                        }
                        vm.tasks[task.state.position][lanePos].push(task);
                    }
                });
            });
        });
    }

    function projectController($stateParams, projectResourceSrv) {
        var vm = this;
        vm.project = projectResourceSrv.get({id: $stateParams.id});
    }

    function kanbanController($state, $stateParams, $modal, taskResource, taskStateResource, swimlaneResource, categoryResource, memberResource) {
        var vm = this;
        kanbanLoader(vm, taskStateResource, swimlaneResource, taskResource, $stateParams.id);
        vm.loadCategory = function () {
            return vm.categories ? null : vm.categories = categoryResource.query({projectId: $stateParams.id});
        };
        vm.loadMember = function () {
            return vm.members ? null : vm.members = memberResource.query({projectId: $stateParams.id});
        };
        vm.kanbanSortOptions = {
            itemMoved: function (event) {
                var taskUpdated = event.source.itemScope.modelValue;
                var swimlaneId = event.dest.sortableScope.element.attr("data-rowindex");
                var taskStateId = event.dest.sortableScope.element.attr("data-columnindex");
                taskResource.updateState({projectId: $stateParams.id, id: taskUpdated.id, stateId: taskStateId}, function () {
                    if (swimlaneId) {
                        taskResource.updateSwimlane({projectId: $stateParams.id, id: taskUpdated.id, swimlaneId: swimlaneId});
                    } else {
                        taskResource.removeSwimlane({projectId: $stateParams.id, id: taskUpdated.id});
                    }
                    //Todo mise à jour nb tâche par état
                });
            }
        };
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/tasks/add.html",
                controller: "newTaskController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                kanbanLoader(vm, taskStateResource, swimlaneResource, taskResource, $stateParams.id);
            });
        };
        vm.goToTask = function (taskId) {
            $state.transitionTo("app.project-detail.task", {id: $stateParams.id, taskId: taskId});
        };
        vm.saveTask = function(task) {
            if (task.category) {
                task.categoryId = task.category.id;
            }
            if (task.assignee) {
                task.assigneeId = task.assignee.id;
            }
            task = taskResource.save({projectId: $stateParams.id, id: task.id}, task);
        }
    }

    function newProjectController($modalInstance, projectResourceSrv) {
        var vm = this;
        vm.project = {};
        vm.submit = function () {
            projectResourceSrv.save(vm.project, function () {
                $modalInstance.close();
            });
        };
    }

    function projectListController($state, $modal, projectResourceSrv) {
        var vm = this;
        vm.projects = projectResourceSrv.query();
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/add.html",
                controller: "newProjectController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.projects = projectResourceSrv.query();
            });
        };
        vm.delete = function (projectId) {
            projectResourceSrv.delete({id: projectId}, function () {
                vm.projects = projectResourceSrv.query();
            });
        };
        vm.edit = function (projectId) {
            $state.transitionTo("app.project-detail.kanban", {id: projectId});
        };
    }

    function projectResource($resource) {
        return $resource("/api/project/:id", {id: "@id"}, {
            query: {isArray: false},
            user: {url: "/api/userProject", method: "GET"}
        });
    }

    function projectConfig($stateProvider) {
        $stateProvider.state("app.projects", {
            templateUrl: "templates/projects/list.html",
            controller: "projectListController",
            controllerAs: "projectCtrl",
            url: "projects"
        });
        $stateProvider.state("app.project-detail", {
            abstract: true,
            controller: "projectController",
            controllerAs: "projectCtrl",
            templateUrl: "templates/projects/layout-single.html",
            url: "project/:id"
        });
        $stateProvider.state("app.project-detail.kanban", {
            templateUrl: "templates/projects/kanban.html",
            controller: "kanbanController",
            controllerAs: "kanbanCtrl",
            url: "/kanban"
        });
    }

    projectConfig.$inject = ["$stateProvider"];
    projectListController.$inject = ["$state", "$modal", "projectResource"];
    projectController.$inject = ["$stateParams", "projectResource"];
    kanbanController.$inject = ["$state", "$stateParams", "$modal", "taskResource",
        "taskStateResource", "swimlaneResource",
        "categoryResource", "memberResource"];
    newProjectController.$inject = ["$modalInstance", "projectResource"];
    projectResource.$inject = ["$resource"];


    angular.module("kanban.project", ["kanban.project.task", "kanban.project.configure", "kanban.project.reports"])
            .config(projectConfig)
            .controller("projectListController", projectListController)
            .controller("projectController", projectController)
            .controller("kanbanController", kanbanController)
            .controller("newProjectController", newProjectController)
            .service("projectResource", projectResource);
})();