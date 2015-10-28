(function () {
    "use strict";

    function uiAutocomplete() {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, controller) {
                var getOptions = function () {
                    return angular.extend({}, scope.$eval(attrs.uiAutocomplete));
                };
                var initAutocompleteWidget = function () {
                    var opts = getOptions();
                    element.autocomplete(opts);
                    if (opts._renderItem) {
                        element.data("ui-autocomplete")._renderItem = opts._renderItem;
                    }
                };
                // Watch for changes to the directives options
                scope.$watch(getOptions, initAutocompleteWidget, true);
            }
        };
    }
    ;



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
        $rootScope.loginOngoing = false;
        $rootScope.$on("event:auth-forbidden", function () {
            var parentState = $state.get("^");
            if (parentState.abstract) {
                $state.go("app.dashboard");
            } else {
                $state.go(parentState);
            }
        });
        $rootScope.$on("event:auth-loginRequired", function () {
            delete $rootScope.$session.oauth;
            delete $rootScope.$session.user;
            var modalScope = $rootScope.$new();
            if (!$rootScope.loginOngoing) {
                $rootScope.loginOngoing = true;
                modalScope.modalInstance = $modal.open({
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
                            authService.loginConfirmed();
                            $rootScope.loginOngoing = false;
                        }
                );
            }
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
        $stateProvider.state("app.profil", {
            templateUrl: "templates/users/profil.html",
            controller: "profilController",
            controllerAs: "profilCtrl",
            url: "profil"
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
    headerController.$inject = ["$scope", "$state"];

    angular.module("kanban", ["ngRoute", "ui.router", "ui.bootstrap", "ui.calendar",
        "ngStorage", "http-auth-interceptor", "xeditable", "kanban.login",
        "kanban.user", "kanban.dashboard"])
            .config(applicationConfig)
            .run(runApp)
            .controller("headerController", headerController)
            .directive('uiAutocomplete', uiAutocomplete);
})();
