/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () {
    "use strict";

    function homeController($rootScope, $sessionStorage, userResourceAssembler) {
        var vm = this;
        userResourceAssembler.projects($sessionStorage.user, {}).then(function(data) {
            vm.projectsPage = data;
        });
        vm.tasks = userResourceAssembler.tasks($sessionStorage.user, {});
        $rootScope.$on("event:allocationUpdated", function () {
            vm.tasks = userResourceAssembler.tasks($sessionStorage.user, {});
        });
    }
    homeController.$inject = ["$rootScope", "$sessionStorage", "currentUserResourceAssembler"];
    angular.module("kanban.dashboard", ["ui.router", "ui.bootstrap", "kanban.api", "kanban.user", "kanban.project"])
            .controller("homeController", homeController);
})();