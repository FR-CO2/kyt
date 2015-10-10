(function () {
    "use strict";

    function taskImportController($stateParams, $modalInstance, $http) {
        var vm = this;
        vm.title = "Importer des tâches";
        vm.submit = function () {
            var formData = new FormData();
            formData.append("importfile", vm.fileInput);
            $http({
                method: 'POST',
                url: '/api/project/' + $stateParams.id + '/task/import',
                headers: {'Content-Type': undefined},
                data: formData
            }).success(function () {
                $modalInstance.close();
            }).error(function (e) {
                vm.form = {error: e};
            });
        };
    }

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

    function taskListController($state, $stateParams, $http, $modal, taskResourceSrv, taskStateResource, swimlaneResource, categoryResource, memberResource) {
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
        vm.loadState = function () {
            return vm.states ? null : vm.states = taskStateResource.query({projectId: $stateParams.id});
        };
        vm.loadSwimlane = function () {
            return vm.swimlanes ? null : vm.swimlanes = swimlaneResource.query({projectId: $stateParams.id});
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
        vm.export = function () {
            // Creating a Blob with our data for download
            // this will parse the URL in ng-href such as: blob:http...
            $http({method: 'GET',
                url: '/api/project/' + $stateParams.id + '/task/export',
                headers: {'Content-Type': undefined}})
                    .then(function (response) {
                        var blob = new Blob([response.data], {type: 'text/csv'});
                        saveAs(blob, "export-tasks.csv");
                    });
        };

        vm.import = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/common/import.html",
                controller: "taskImportController",
                controllerAs: "import",
                size: "xs"
            });
            modalInstance.result.then(function () {
                vm.users = taskResourceSrv.page(vm.paging);
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

    function allocationResource($resource) {
        return $resource("/api/project/:projectId/allocation/", {projectId: "@projectId"}, {
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
    taskListController.$inject = ["$state", "$stateParams", "$http", "$modal", "taskResource", "taskStateResource", "swimlaneResource", "categoryResource", "memberResource"];
    editTaskController.$inject = ["$stateParams", "taskResource", "categoryResource", "memberResource", "taskStateResource", "swimlaneResource"];
    taskImportController.$inject = ["$stateParams", "$modalInstance", "$http"];
    taskResource.$inject = ["$resource"];
    allocationResource.$inject = ["$resource"];
    angular.module("kanban.project.task", [])
            .config(taskConfig)
            .controller("newTaskController", newTaskController)
            .controller("taskListController", taskListController)
            .controller("editTaskController", editTaskController)
            .controller("taskImportController", taskImportController)
            .service("taskResource", taskResource)
            .service("allocationResource", allocationResource);
})();