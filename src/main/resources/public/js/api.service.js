/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";

    function projectElement($q, $resource, linkName) {
        return {
            add: function (project, element) {
                var defer = $q.defer();
                $resource(project._links[linkName].href).save(element, function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            },
            remove: function (element) {
                var defer = $q.defer();
                $resource(element._links.self.href).delete(function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
        };
    }

    function projectTask($q, $resource) {
        return projectElement($q, $resource, "tasks");
    }

    function projectMember($q, $resource) {
        return projectElement($q, $resource, "members");
    }

    function projectCategory($q, $resource) {
        return projectElement($q, $resource, "category");
    }

    function projectState($q, $resource) {
        return projectElement($q, $resource, "states");
    }
    function projectSwimlane($q, $resource) {
        return projectElement($q, $resource, "swimlanes");
    }

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
                if (task._links.assignee) {
                    task.assignee = $resource(task._links.assignee.href).get();
                }
                if (task._links.backup) {
                    task.backup = $resource(task._links.backup.href).get();
                }
                if (task._links.category) {
                    task.category = $resource(task._links.category.href).get();
                }
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
        var userResource = $resource("/api/user/:id");
        return {
            page: function (page) {
                var defer = $q.defer();
                userResource.get({page: page.page, size: page.size}, function (response) {
                    var userPage = {
                        page: response.page,
                        users: []
                    };
                    if (response._embedded) {
                        angular.forEach(response._embedded.userResources, function (user) {
                            userPage.users.push(user);
                        });
                    }
                    defer.resolve(userPage);
                });
                return defer.promise;
            },
            add: function (user) {
                var defer = $q.defer();
                userResource.save(user, function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
            ,
            delete: function (id) {
                var defer = $q.defer();
                userResource.delete({id: id}, function (data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
        };
    }

    function projectResource($q, $resource, projectResourceAssembler) {
        var resource = $resource("/api/project/:id", {id: "@id"}, {
            query: {isArray: false}});
        return {
            query: function (page) {
                var defer = $q.defer();
                resource.query(page, function (response) {
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
            get: function (id) {
                var defer = $q.defer();
                resource.get({id: id}, function (response) {
                    return defer.resolve(response);
                });
                return defer.promise;
            },
            save: function (project) {
                var defer = $q.defer();
                resource.save(project, function (response) {
                    return defer.resolve(response);
                });
                return defer.promise;
            },
            remove: function (id) {
                var defer = $q.defer();
                resource.delete({id: id}, function (response) {
                    return defer.resolve(response);
                });
                return defer.promise;
            }
        };
    }

    function applicationRoleResource($resource) {
        return $resource("/api/role");
    }

    function projectRoleResource($resource) {
        return $resource("/api/role/project");
    }

    projectResource.$inject = ["$q", "$resource", "projectResourceAssembler"];
    projectRoleResource.$inject = ["$resource"];
    applicationRoleResource.$inject = ["$resource"];
    userResourceAssembler.$inject = ["$q", "$resource"];
    projectResourceAssembler.$inject = ["$q", "$resource", "taskResourceAssembler"];
    projectMember.$inject = ["$q", "$resource"];
    projectCategory.$inject = ["$q", "$resource"];
    projectState.$inject = ["$q", "$resource"];
    projectTask.$inject = ["$q", "$resource"];
    projectSwimlane.$inject = ["$q", "$resource"];
    taskResourceAssembler.$inject = ["$resource"];
    currentUserResourceAssembler.$inject = ["$q", "$resource", "projectResourceAssembler"];
    angular.module("kanban.api", ["ngResource"])
            .service("projectResourceAssembler", projectResourceAssembler)
            .service("projectResource", projectResource)
            .service("projectRoleResource", projectRoleResource)
            .service("projectMember", projectMember)
            .service("projectCategory", projectCategory)
            .service("projectState", projectState)
            .service("projectTask", projectTask)
            .service("projectSwimlane", projectSwimlane)
            .service("taskResourceAssembler", taskResourceAssembler)
            .service("currentUserResourceAssembler", currentUserResourceAssembler)
            .service("userResourceAssembler", userResourceAssembler)
            .service("applicationRoleResource", applicationRoleResource);
})();