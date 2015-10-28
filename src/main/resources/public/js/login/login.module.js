/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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


function profilController(userProjectsRoles) {
    var vm = this;
    vm.projectsRoles = userProjectsRoles.query();
}

function userProfile($resource) {
    return $resource("/api/userProfile");
}

function userProjectsRoles($resource) {
    return $resource("/api/userProjectRole");
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

loginController.$inject = ["$state", "$scope", "userProfile", "appAuthService"];
profilController.$inject = ["userProjectsRoles"];
appAuthService.$inject = ["$http"];
userProfile.$inject = ["$resource"];
userProjectsRoles.$inject = ["$resource"];

angular.module("kanban.login", ["ngResource", "ngRoute", "ui.router", "ui.bootstrap",
    "ngStorage", "kanban.user"])
        .controller("loginController", loginController)
        .controller("profilController", profilController)
        .service("appAuthService", appAuthService)
        .service("userProfile", userProfile)
        .service("userProjectsRoles", userProjectsRoles);