(function () {
    "use strict";
    function homeController($state, $modal, projectResource, taskResource, $sessionStorage) {
        var vm = this;
        vm.uiConfig = {
            calendar: {
                editable: true,
                lang: 'fr',
                header: {
                    left: "title",
                    center: "",
                    right: "today prev,next"
                },
                dayClick: function (date) {
                    $modal.open({
                        animation: true,
                        templateUrl: "templates/timesheet/day.html",
                        controller: "timesheetController",
                        controllerAs: "tsCtrl",
                        size: "md",
                        resolve: {
                            dateTS: function () {
                                return date;
                            }
                        }
                    });
                }
            }
        };
        vm.projects = projectResource.user();
        vm.tasks = taskResource.user();
        vm.events = [{
                url: "/api/userEvent",
                headers: {
                    Authorization: $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token
                },
                eventDataTransform: function (event) {
                    var eventTransform = {};
                    eventTransform.title = event.name;
                    eventTransform.start = new Date(event.plannedStart);
                    eventTransform.end = new Date(event.plannedEnding);
                    if (event.category) {
                        var cat = event.category;
                        if (cat.color) {
                            eventTransform.color = cat.color;
                        }
                        if (cat.bgcolor) {
                            eventTransform.backgroundColor = cat.bgcolor;
                        }
                        eventTransform.url = "#/project/" + event.project.id + "/task/" + event.id;
                    }
                    return eventTransform;
                }
            }];
        vm.goProject = function (projectId) {
            $state.transitionTo("app.project-detail.kanban", {id: projectId});
        };
        vm.goTask = function (projectId, taskId) {
            $state.transitionTo("app.project-detail.task", {"id": projectId, "taskId": taskId});
        };
    }

    function appAuthService($http) {
        return {
            login: function (credentials) {
                var config = {
                    method: "POST",
                    url: "/oauth/token",
                    headers: {
                        Authorization: "Basic " + btoa("clientapp:123456")
                    },
                    withCredentials: true,
                    params: {
                        username: credentials.username,
                        password: credentials.password,
                        grant_type: "password",
                        scope: "read write"
                    }
                };
                return $http(config);
            }
        };
    }

    function userProfile($resource) {
        return $resource("/api/userProfile");
    }

    function loginController($state, $scope, userProfileSrv, appAuthService) {
        var vm = this;
        vm.authenticate = function () {
            appAuthService.login(vm.loginForm).success(function (result) {
                $scope.$session.oauth = result;
                $scope.$session.user = userProfileSrv.get();
                vm.loginForm = {};
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                } else {
                    $state.transitionTo("app.dashboard");
                }
            }).error(function () {
                vm.loginForm = {};
                vm.loginForm.error = "Login/password invalide";
            });
        };
    }

    function headerController($scope, $state) {
        var vm = this;
        vm.logout = function () {
            delete $scope.$session.oauth;
            delete $scope.$session.user;
            $state.transitionTo("login");
        };
    }

    function runApp($rootScope, $state, $modal, $sessionStorage, $localStorage, editableOptions, authService) {
        $rootScope.$storage = $localStorage;
        $rootScope.$session = $sessionStorage;
        editableOptions.theme = 'bs3';
        $rootScope.$on("event:auth-loginRequired", function () {
            delete $rootScope.$session.oauth;
            delete $rootScope.$session.user;
            var modalScope  = $rootScope.$new();
            $modal.open({
                animation: true,
                templateUrl: "login.html",
                controller: "loginController",
                controllerAs: "login",
                scope: modalScope,
                backdrop: "static",
                size: "md"
            });
            modalScope.modalInstance.result.then(
                    function (result) {
                        // Closed
                    },function () {
                        // Dismissed
                        ;
                    }
            );
        });
        $state.go("login");
    }

    function applicationConfig($stateProvider, $httpProvider) {
        $stateProvider.state("app", {
            templateUrl: "layout-app.html",
            url: "/"
        });
        $stateProvider.state("app.dashboard", {
            templateUrl: "templates/dashboard.html",
            controller: "homeController",
            controllerAs: "homeCtrl",
            url: "home"
        });
        $stateProvider.state("login", {
            templateUrl: "login.html",
            controller: "loginController",
            controllerAs: "login",
            url: "/login"
        });
        $httpProvider.interceptors.push(function ($sessionStorage) {
            return {
                "request": function (config) {
                    if (config.url.indexOf(".html") === -1 && $sessionStorage.oauth) {
                        config.headers.authorization = $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token;
                        config.withCredentials = true;
                    }
                    return config;
                }
            };
        });
    }

    applicationConfig.$inject = ["$stateProvider", "$httpProvider"];
    runApp.$inject = ["$rootScope", "$state", "$modal", "$sessionStorage", "$localStorage", "editableOptions", "authService"];
    loginController.$inject = ["$state", "$scope", "userProfile", "appAuthService"];
    headerController.$inject = ["$scope", "$state"];
    homeController.$inject = ["$state", "$modal", "projectResource", "taskResource", "$sessionStorage"];
    appAuthService.$inject = ["$http"];
    userProfile.$inject = ["$resource"];
    angular.module("kaban", ["ngResource", "ngRoute", "ui.router", "ui.bootstrap", "ui.calendar",
        "ui.sortable", "ngStorage", "http-auth-interceptor", "xeditable", "chart.js",
        "kanban.project", "kanban.user", "kanban.user", "kaban.timesheet"])
            .config(applicationConfig)
            .run(runApp)
            .controller("headerController", headerController)
            .controller("homeController", homeController)
            .controller("loginController", loginController)
            .service("appAuthService", appAuthService)
            .service("userProfile", userProfile);
})();
