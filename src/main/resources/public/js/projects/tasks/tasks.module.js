(function () {
    "use strict";

    function editTaskController($stateParams, taskResourceSrv, categoryResource,
            memberResource, stateResource, swimlaneResource) {
        var vm = this;
        vm.categories = categoryResource.query({"projectId": $stateParams.id});
        vm.members = memberResource.query({"projectId": $stateParams.id});
        vm.states = stateResource.query({"projectId": $stateParams.id});
        vm.swimlanes = swimlaneResource.query({"projectId": $stateParams.id});
        vm.task = taskResourceSrv.get({"projectId": $stateParams.id, "id": $stateParams.taskId},
        function (data) {
            if (data.plannedStart) {
                vm.task.plannedStart = new Date(data.plannedStart);
            }
            if (data.plannedEnding) {
                vm.task.plannedEnding = new Date(data.plannedEnding);
            }
        });
        vm.submit = function () {
            taskResourceSrv.save({"projectId": $stateParams.id}, vm.task);
        };
    }

    function newTaskController($modalInstance, project, projectResourceAssembler, projectTask) {
        var vm = this;
        vm.categories = projectResourceAssembler.category(project);
        vm.submit = function () {
            projectTask.add(project, vm.task).then(function () {
                $modalInstance.close();
            });
        };
    }

    function taskListController($stateParams, $modal, project, projectResourceAssembler) {
        var vm = this;
        vm.tasks = {
            page: {}
        };
        projectResourceAssembler.tasks(project, vm.tasks.page).then(function (data) {
            vm.tasks = data;
        });
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/tasks/add.html",
                controller: "newTaskController",
                controllerAs: "add",
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                size: "md"
            });
            modalInstance.result.then(function () {
                projectResourceAssembler.tasks(project, vm.tasks.page).then(function (data) {
                    vm.taks = data;
                });
            });
        };
        vm.delete = function (taskId) {
            taskResourceSrv.delete({projectId: $stateParams.id, id: taskId}, function () {
                vm.tasks = taskResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page});
            });
        };
        vm.saveTask = function (task) {
            if (task.category) {
                task.categoryId = task.category.id;
            }
            if (task.assignee) {
                task.assigneeId = task.assignee.id;
            }
            task = taskResourceSrv.save({projectId: $stateParams.id, id: task.id}, task);
        };
        vm.changeState = function (task) {
            if (task.state) {
                taskResourceSrv.updateState({projectId: $stateParams.id, id: task.id, stateId: task.state.id});
            }
        };
        vm.changeSwimlane = function (task) {
            if (task.swimlane) {
                taskResourceSrv.updateSwimlane({projectId: $stateParams.id, id: task.id, swimlaneId: task.swimlane.id});
            } else {
                taskResourceSrv.removeSwimlane({projectId: $stateParams.id, id: task.id});
            }
        };
        vm.pageChanged = function () {
            if (vm.nbElt !== vm.paging.size) {
                vm.numPage = 1;
            }
            ;
            vm.paging = {
                size: vm.nbElt,
                page: vm.numPage - 1
            };
            vm.tasks = taskResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page}, function (result) {
                vm.numPage = result.number + 1;
            });
        };
    }

    function taskResource($resource) {
        return $resource("/api/project/:projectId/task/:id", {projectId: "@projectId", id: "@id"}, {
            kanban: {url: "/api/project/:projectId/task/kanban", method: "GET", isArray: true},
            page: {url: "/api/project/:projectId/task/page", method: "GET", isArray: false},
            updateState: {
                url: "/api/project/:projectId/task/:id/state/:stateId",
                method: "POST",
                params: {stateId: "@stateId"}
            },
            updateSwimlane: {
                url: "/api/project/:projectId/task/:id/swimlane/:swimlaneId",
                method: "POST",
                params: {swimlaneId: "@swimlaneId"}
            },
            removeSwimlane: {
                url: "/api/project/:projectId/task/:id/swimlane",
                method: "DELETE"
            },
            user: {url: "/api/userTask", method: "GET"},
            userDay: {url: "/api/userTask/day/:day", method: "GET", params: {day: "@day"}, isArray: true},
            searchByName: {url: "/api/userTask/search/:day/:name", method: "GET", params: {day: "@day", name: "@name"}, isArray: true}
        });
    }


    function taskConfig($stateProvider) {
        $stateProvider.state("app.project.tasks", {
            templateUrl: "templates/projects/tasks/list.html",
            controller: "taskListController",
            controllerAs: "taskCtrl",
            url: "/tasks"
        });
        $stateProvider.state("app.project.task", {
            templateUrl: "templates/projects/tasks/task-layout.html",
            controller: "editTaskController",
            controllerAs: "edit",
            resolve: {
                task: ["$stateParams", "taskResource", function ($stateParams, taskResource) {
                        return taskResource.get($stateParams.taskId);
                    }]
            },
            url: "/task/:taskId"
        });
        $stateProvider.state("app.project.task.general", {
            templateUrl: "templates/projects/tasks/edit.html",
            controller: "editTaskController",
            controllerAs: "edit",
            url: "/general"
        });
        $stateProvider.state("app.project.task.allocation", {
            templateUrl: "templates/projects/tasks/timesheet/synthese.html",
            controller: "timesheetSynthese",
            controllerAs: "allocation",
            url: "/allocation"
        });
        $stateProvider.state("app.project.task.comment", {
            templateUrl: "templates/projects/tasks/comment/list.html",
            controller: "commentListController",
            controllerAs: "comment",
            url: "/comment"
        });
        $stateProvider.state("app.project.task.history", {
            templateUrl: "templates/projects/tasks/history/list.html",
            controller: "historyListController",
            controllerAs: "history",
            url: "/history"
        });
    }

    taskConfig.$inject = ["$stateProvider"];
    newTaskController.$inject = ["$modalInstance", "project", "projectResourceAssembler", "projectTask"];
    taskListController.$inject = ["$stateParams", "$modal", "project", "projectResourceAssembler"];
    editTaskController.$inject = ["$stateParams", "taskResource"];
    taskResource.$inject = ["$resource"];

    angular.module("kanban.project.task", ["kanban.project.task.timesheet", "kanban.project.task.comment", "kanban.project.task.history"])
            .config(taskConfig)
            .controller("newTaskController", newTaskController)
            .controller("taskListController", taskListController)
            .controller("editTaskController", editTaskController)
            .service("taskResource", taskResource);
})();