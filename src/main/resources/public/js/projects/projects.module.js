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


    function projectImportController($modalInstance, $http) {
        var vm = this;
        vm.title = "Importer des projets";
        vm.submit = function () {
            var formData = new FormData();
            formData.append("importfile", vm.fileInput);
            $http({
                method: 'POST',
                url: '/api/project/import',
                headers: {'Content-Type': undefined},
                data: formData
            }).success(function () {
                $modalInstance.close();
            }).error(function (e) {
                vm.form = {error: e};
            });
        };
    }

    function projectController($sessionStorage, resolvedProject, userProjectsRoles) {
        var vm = this;
        vm.project = resolvedProject;
        vm.hasEditRights = false;
        vm.hasAdminRights = false;
        if ($sessionStorage.user.applicationRole === 'ADMIN') {
            vm.hasEditRights = true;
            vm.hasAdminRights = true;
        } else {
            var projectsRoles = userProjectsRoles.query();
            projectsRoles.$promise.then(function () {
                for (var i = 0; i < projectsRoles.length; i++) {
                    if (projectsRoles[i].project.id == resolvedProject.id) {
                        if (projectsRoles[i].projectRole === 'CONTRIBUTOR') {
                            vm.hasEditRights = true;
                        }
                        if (projectsRoles[i].projectRole === 'MANAGER') {
                            vm.hasEditRights = true;
                            vm.hasAdminRights = true;
                        }
                    }
                }
            });
        }
    }

    function kanbanController($stateParams, $modal, taskResource, taskStateResource, swimlaneResource) {
        var vm = this;
        kanbanLoader(vm, taskStateResource, swimlaneResource, taskResource, $stateParams.id);
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
        vm.saveTask = function (task) {
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

    function projectListController($state, $modal, $http, projectResourceSrv) {
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
    }

    function projectConfig($stateProvider) {
        $stateProvider.state("app.projects", {
            templateUrl: "templates/projects/list.html",
            controller: "projectListController",
            controllerAs: "projectCtrl",
            url: "projects"
        });
        $stateProvider.state("app.project", {
            abstract: true,
            controller: "projectController",
            controllerAs: "projectCtrl",
            templateUrl: "templates/projects/layout-single.html",
            url: "project/:id",
            resolve: {
                project: ["$stateParams", "projectResource", function ($stateParams, projectResource) {
                    return projectResource.get({id: $stateParams.id});
                }]
            }
        });
        $stateProvider.state("app.project.kanban", {
            templateUrl: "templates/projects/kanban.html",
            controller: "kanbanController",
            controllerAs: "kanbanCtrl",
            url: "/kanban"
        });
    }

    projectConfig.$inject = ["$stateProvider"];
    projectListController.$inject = ["$state", "$modal", "$http", "projectResource"];
    projectController.$inject = ["$sessionStorage", "project", "userProjectsRoles"];
    kanbanController.$inject = ["$stateParams", "$modal", "taskResource",
        "taskStateResource", "swimlaneResource"];
    newProjectController.$inject = ["$modalInstance", "projectResource"];
    projectImportController.$inject = ["$modalInstance", "$http"];

    angular.module("kanban.project", ["kanban.project.task", "kanban.project.configure", "kanban.project.reports"])
            .config(projectConfig)
            .controller("projectListController", projectListController)
            .controller("projectController", projectController)
            .controller("kanbanController", kanbanController)
            .controller("newProjectController", newProjectController)
            .controller("projectImportController", projectImportController);
})();