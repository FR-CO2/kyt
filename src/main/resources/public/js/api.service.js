/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";

    function projectResourceAssembler($q, $resource, taskResourceAssembler) {
        return {
            assemble: function (project, withSwimlanes) {
                project.states = $resource(project._links.states.href).query();
                if (withSwimlanes) {
                    project.swimlanes = $resource(project._links.swimlanes.href).query();
                }
                return project;
            },
            tasks: function (project, page) {
                var defer = $q.defer();
                $resource(project._links.tasks.href).get({page: page.page, size: page.size}, function (response) {
                    var taskPage = {
                        page: response.page,
                        tasks: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.taskResources, function (task) {
                            taskPage.tasks.push(taskResourceAssembler.assemble(task));
                        });
                    }
                    defer.resolve(taskPage);
                });
                return defer.promise;
            },
            kanban: function (project) {

            },
            members: function (project, page) {
                var defer = $q.defer();
                $resource(project._links.members.href).get({page: page.page, size: page.size}, function (response) {
                    var membersPage = {
                        page: response.page,
                        members: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.memberResources, function (member) {
                            membersPage.members.push(member);
                        });
                    }
                    defer.resolve(membersPage);
                });
                return defer.promise;
            },
            states: function (project) {
                return $resource(project._links.states.href).query();
            },
            swimlane: function (project) {
                return $resource(project._links.swimlanes.href).query();
            },
            category: function (project) {
                return $resource(project._links.category.href).query();
            }
        };
    }

    function taskResourceAssembler($resource) {
        return {
            assemble: function (task, withStateAndSwimlane) {
                if (withStateAndSwimlane) {
                    task.state = $resource(task._links.state.href).get();
                    task.swimlane = $resource(task._links.swimlane.href).get();
                }
                task.assignee = $resource(task._links.assignee.href).get();
                task.backup = $resource(task._links.backup.href).get();
                task.category = $resource(task._links.category.href).get();
                return task;
            },
            allocations: function (task) {
                return $resource(task._links.allocations.href).query();
            },
            history: function (task) {
                return $resource(task._links.history.href).query();
            },
            comments: function (task) {
                return $resource(task._links.comments.href).query();
            }
        };
    }

    function currentUserResourceAssembler($q, $resource, projectResourceAssembler) {
        return {
            projects: function (user, page) {
                var defer = $q.defer();
                $resource(user._links.project.href).get({page: page.page, size: page.size}, function (response) {
                    var projectPage = {
                        page: response.page,
                        projects: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.projectResources, function (project) {
                            projectPage.projects.push(projectResourceAssembler.assemble(project));
                        });
                    }
                    defer.resolve(projectPage);
                });
                return defer.promise;
            },
            tasks: function (user, page) {
                var defer = $q.defer();
                $resource(user._links.task.href).get({page: page.page, size: page.size}, function (response) {
                    var taskPage = {
                        page: response.page,
                        tasks: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.taskResources, function (task) {
                            taskPage.tasks.push(taskResourceAssembler.assemble(task));
                        });
                    }
                    defer.resolve(taskPage);
                });
                return defer.promise;
            },
            projectsrole: function (user) {
                return $resource(user._links.roles.href).query();
            }
        };
    }

    function userResourceAssembler($q, $resource) {
        var userResource = $resource("/api/user");
        return {
            page: function (page) {
                var defer = $q.defer();
                userResource.get({page: page.page, size: page.size}, function (response) {
                    var userPage = {
                        page: response.page,
                        users: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.taskResources, function (user) {
                            userPage.users.push(user);
                        });
                    }
                    defer.resolve(userPage);
                });
                return defer.promise;
            }
        };
    }

    function projectResource($resource) {
        return $resource("/api/project/:id", {id: "@id"}, {
            query: {isArray: false}
        });
    }

    function applicationRoleResource($resource) {
        return $resource("/api/role");
    }

    projectResource.$inject = ["$resource"];
    applicationRoleResource.$inject = ["$resource"];
    userResourceAssembler.$inject = ["$q", "$resource"];
    projectResourceAssembler.$inject = ["$q", "$resource", "taskResourceAssembler"];
    taskResourceAssembler.$inject = ["$resource"];
    currentUserResourceAssembler.$inject = ["$q", "$resource", "projectResourceAssembler"];
    angular.module("kanban.api", ["ngResource"])
            .service("projectResourceAssembler", projectResourceAssembler)
            .service("projectResource", projectResource)
            .service("taskResourceAssembler", taskResourceAssembler)
            .service("currentUserResourceAssembler", currentUserResourceAssembler)
            .service("userResourceAssembler", userResourceAssembler)
            .service("applicationRoleResource", applicationRoleResource);
})();