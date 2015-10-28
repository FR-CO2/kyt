/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";

    function userLinksService($q, $resource) {
        return {
            retrieveProjects: function (user) {
                var defer = $q.defer();
                $resource(user._links.project.href).get(function (response) {
                    var projectPage = {
                        page: response.page,
                        projects: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.projectResources, function (project) {
                            project.states = $resource(project._links.states.href).query();
                            projectPage.projects.push(project);
                        });
                    }
                    defer.resolve(projectPage);
                });
                return defer.promise;
            },
            retrieveTasks: function (user) {
                var defer = $q.defer();
                $resource(user._links.task.href).get(function (response) {
                    var taskPage = {
                        page: response.page,
                        tasks: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.stateResource, function (task) {
                            task.state = $resource(task._links.state.href).get();
                            taskPage.projects.push(task);
                        });
                    }
                    defer.resolve(taskPage);
                });
                return defer.promise;
            }
        }
    }

    function homeController($rootScope, $sessionStorage, userLinksService) {
        var vm = this;
        userLinksService.retrieveProjects($sessionStorage.user).then(
                function (data) {
                    vm.projectsList = data;
                });
        userLinksService.retrieveTasks($sessionStorage.user).then(
                function (data) {
                    vm.tasks = data;
                });
        $rootScope.$on("event:allocationUpdated", function () {
            userLinksService.retrieveTasks($sessionStorage.user).then(
                    function (data) {
                        vm.tasks = data;
                    });
        });
    }
    homeController.$inject = ["$rootScope", "$sessionStorage", "userLinksService"];
    userLinksService.$inject = ["$q", "$resource"];
    angular.module("kanban.dashboard", ["ui.router", "ui.bootstrap", "kanban.user", "kanban.project"])
            .controller("homeController", homeController)
            .service("userLinksService", userLinksService);
})();