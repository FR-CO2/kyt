(function () {
    "use strict";
    function editTaskController($filter, $stateParams, taskResourceSrv, categoryResource,
            memberResource, stateResource, swimlaneResource) {
        var vm = this;
        vm.categories = categoryResource.query({"projectId": $stateParams.id});
        vm.members = memberResource.query({"projectId": $stateParams.id});
        vm.states = stateResource.query({"projectId": $stateParams.id});
        vm.swimlanes = swimlaneResource.query({"projectId": $stateParams.id});
        vm.task = taskResourceSrv.get({"projectId": $stateParams.id, "id": $stateParams.taskId},
        function (result) {
            vm.plannedStartFmt = new Date(result.plannedStart);
            vm.plannedEndingFmt = new Date(result.plannedEnding);
        });
        vm.submit = function () {
            taskResourceSrv.save({"projectId": $stateParams.id}, vm.task);
        };
    }

    function newTaskController($stateParams, $modalInstance, taskResourceSrv, categoryResource, memberResource) {
        var vm = this;
        vm.categories = categoryResource.query({"projectId": $stateParams.id});
        vm.members = memberResource.query({"projectId": $stateParams.id});
        vm.submit = function () {
            taskResourceSrv.save({"projectId": $stateParams.id}, vm.task, function () {
                $modalInstance.close();
            });
        };
    }

    function taskListController($state, $stateParams, $modal, taskResourceSrv, categoryResource, memberResource) {
        var vm = this;
        vm.nbElt = 10;
        vm.numPage = 1;
        vm.paging = {
            size: vm.nbElt,
            page: 0
        };
        vm.tasks = taskResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/tasks/add.html",
                controller: "newTaskController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.tasks = taskResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page});
            });
        };
        vm.edit = function (taskId) {
            $state.transitionTo("app.project-detail.task", {"id": $stateParams.id, "taskId": taskId});
        };
        vm.delete = function (taskId) {
            taskResourceSrv.delete({projectId: $stateParams.id, id: taskId}, function () {
                vm.tasks = taskResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page});
            });
        };
        vm.loadCategory = function () {
            return vm.categories ? null : vm.categories = categoryResource.query({projectId: $stateParams.id});
        };
        vm.loadMember = function () {
            return vm.members ? null : vm.members = memberResource.query({projectId: $stateParams.id});
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
            user: {url: "/api/userTask", method: "GET"}
        });
    }

    function taskConfig($stateProvider) {
        $stateProvider.state("app.project-detail.tasks", {
            templateUrl: "templates/projects/tasks/list.html",
            controller: "taskListController",
            controllerAs: "taskCtrl",
            url: "/tasks"
        });
        $stateProvider.state("app.project-detail.task", {
            templateUrl: "templates/projects/tasks/edit.html",
            controller: "editTaskController",
            controllerAs: "edit",
            url: "/task/:taskId"
        });
    }

    taskConfig.$inject = ["$stateProvider"];
    newTaskController.$inject = ["$stateParams", "$modalInstance", "taskResource", "categoryResource", "memberResource"];
    taskListController.$inject = ["$state", "$stateParams", "$modal", "taskResource", "categoryResource", "memberResource"];
    editTaskController.$inject = ["$filter", "$stateParams", "taskResource", "categoryResource", "memberResource", "taskStateResource", "swimlaneResource"];
    taskResource.$inject = ["$resource"];
    angular.module("kanban.project.task", [])
            .config(taskConfig)
            .controller("newTaskController", newTaskController)
            .controller("taskListController", taskListController)
            .controller("editTaskController", editTaskController)
            .service("taskResource", taskResource);
})();