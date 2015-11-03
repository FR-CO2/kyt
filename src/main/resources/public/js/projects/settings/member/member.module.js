(function () {
    "use strict";

    function userAutoCompleteCtrl($http, $scope) {
        var vm = this;
        var search = function (request, response) {
            var callback = function (data) {
                response(data);
            };
            $http({"method": "GET", "url": "/api/user/find/" + vm.term})
                    .success(callback);
        };
        var _renderItem = function (ul, item) {
            return $("<li>")
                    .data("item.autocomplete", item)
                    .append("<span ng-click='member.setUser(" + item.id + ")'>" + item.username + "</span>")
                    .appendTo(ul);
        };
        var select = function (event, ui) {
            if (ui.item) {
                $scope.add.member.applicationUserId = ui.item.id;
                vm.term = event.target.value = ui.item.username;
                return false;
            }
        };

        vm.autocompleteOptions = {
            minLength: 1,
            source: search,
            select: select,
            delay: 500,
            _renderItem: _renderItem
        };
    }
    ;

    function memberListController(project, $modal, projectResourceAssembler, projectMember) {
        var vm = this;
        vm.nbElt = 10;
        vm.numPage = 1;
        vm.members = {
            page: {}
        };
        projectResourceAssembler.members(project, vm.members.page).then(function (data) {
            vm.members = data;
        });
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/members/add.html",
                controller: "memberAddController",
                controllerAs: "add",
                size: "md",
                resolve: {
                    project: function () {
                        return project;
                    }
                }

            });
            modalInstance.result.then(function () {
                projectResourceAssembler.members(project, vm.members.page).then(function (data) {
                    vm.members = data;
                });
            });
        };
        vm.delete = function (member) {
            projectMember.remove(member).then(function () {
                projectResourceAssembler.members(project, vm.members.page).then(function (data) {
                    vm.members = data;
                });
            });
        };
        vm.pageChanged = function () {
            projectResourceAssembler.members(project, vm.members.page).then(function (data) {
                vm.members = data;
            });
        };
    }


    function memberAddController(project, $modalInstance, projectMember, projectRoleResource) {
        var vm = this;
        vm.member = {};
        vm.roles = projectRoleResource.query();
        vm.submit = function () {
            projectMember.add(project, vm.member).then(function () {
                $modalInstance.close();
            });
        };
    }

    memberListController.$inject = ["project", "$modal", "projectResourceAssembler", "projectMember"];
    memberAddController.$inject = ["project", "$modalInstance", "projectMember", "projectRoleResource"];
    userAutoCompleteCtrl.$inject = ["$http", "$scope"];

    angular.module("kanban.project.configure.member", [])
            .controller("memberListController", memberListController)
            .controller("memberAddController", memberAddController)
            .controller("userAutoCompleteCtrl", userAutoCompleteCtrl);
})();