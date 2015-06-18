(function () {
    "use strict";
    function homeController($state, projectResource, taskResource) {
        var vm = this;
        vm.events = [];
        vm.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                }
            }
        };
        vm.projects = projectResource.user();
        vm.tasks = taskResource.user();
        vm.goProject = function (projectId) {
            $state.transitionTo("app.project-detail.kanban", {id: projectId});
        };
    }

    function authService($http) {
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

    function loginController($state, $scope, userProfileSrv, authService) {
        var vm = this;
        vm.authenticate = function () {
            authService.login(vm.loginForm).success(function (result) {
                $scope.$session.oauth = result;
                $scope.$session.user = userProfileSrv.get();
                vm.loginForm = {};
                $state.transitionTo("app.dashboard");
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

    function runApp($rootScope, $state, $modal, $sessionStorage, $localStorage, editableOptions) {
        $rootScope.$storage = $localStorage;
        $rootScope.$session = $sessionStorage;
        editableOptions.theme = 'bs3';
        $rootScope.$on("loginRequired", function () {
            delete $rootScope.$session.oauth;
            delete $rootScope.$session.user;
            $modal.open({
                animation: true,
                templateUrl: "login.html",
                controller: "loginController",
                controllerAs: "login",
                backdrop: "static",
                size: "md"
            });
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
    runApp.$inject = ["$rootScope", "$state", "$modal", "$sessionStorage", "$localStorage", "editableOptions"];
    loginController.$inject = ["$state", "$scope", "userProfile", "authService"];
    headerController.$inject = ["$scope", "$state"];
    homeController.$inject = ["$state", "projectResource", "taskResource"];
    authService.$inject = ["$http"];
    userProfile.$inject = ["$resource"];
    angular.module("kaban", ["ngResource", "ngRoute", "ui.router", "ui.bootstrap", "ui.calendar",
        "ui.sortable", "ngStorage", "http-auth-interceptor", "xeditable",
        "kanban.project", "kanban.user"])
            .config(applicationConfig)
            .run(runApp)
            .controller("headerController", headerController)
            .controller("homeController", homeController)
            .controller("loginController", loginController)
            .service("authService", authService)
            .service("userProfile", userProfile);
})();
