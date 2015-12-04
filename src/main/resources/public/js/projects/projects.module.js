(function () {
    "use strict";

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

    function kanbanController($stateParams, $modal, project, projectResourceAssembler, taskResource, taskStateResource, swimlaneResource) {
        var vm = this;
        vm.tasksByState = [];
        projectResourceAssembler.kanban(project).then(function(data){
            vm.tasksByState = data;
        });
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
            projectResourceSrv.save(vm.project).then(function() {
                $modalInstance.close();
            });
        };
    }

    function projectListController($modal, projectResourceSrv) {
        var vm = this;
        vm.projects = {};
        projectResourceSrv.query(vm.projects.page).then(function (data) {
            vm.projects = data;
        });
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/add.html",
                controller: "newProjectController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                projectResourceSrv.query(vm.projects.page).then(function (data) {
                    vm.projects = data;
                });
            });
        };
        vm.delete = function (projectId) {
            projectResourceSrv.remove(projectId).then(function () {
                projectResourceSrv.query(vm.projects.page).then(function (data) {
                    vm.projects = data;
                });
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
                        return projectResource.get($stateParams.id);
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
    projectListController.$inject = ["$modal", "projectResource"];
    projectController.$inject = ["$sessionStorage", "project", "userProjectsRoles"];
    kanbanController.$inject = ["$stateParams", "$modal", "project", "projectResourceAssembler", "taskResource",
        "taskStateResource", "swimlaneResource"];
    newProjectController.$inject = ["$modalInstance", "projectResource"];

    angular.module("kanban.project", ["kanban.project.task", "kanban.project.configure", "kanban.project.reports"])
            .config(projectConfig)
            .controller("projectListController", projectListController)
            .controller("projectController", projectController)
            .controller("kanbanController", kanbanController)
            .controller("newProjectController", newProjectController);
})();