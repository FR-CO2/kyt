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

    function memberListController(project, $modal, projectResourceAssembler) {
        var vm = this;
        vm.nbElt = 10;
        vm.numPage = 1;
        vm.paging = {
            size: vm.nbElt,
            page: 0
        };
        projectResourceAssembler.members(project, {size: vm.paging.size, page: vm.paging.page}).then(function (data) {
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
            projectResourceAssembler.members(project, {size: vm.members.page.size, page: vm.members.page.page}).then(function (data) {
                vm.members = data;
            });
        };
        vm.delete = function (memberId) {

        };
        vm.pageChanged = function () {
            projectResourceAssembler.members(project, {size: vm.members.page.size, page: vm.members.page.page}).then(function (data) {
                vm.members = data;
            });
        };
    }


    function memberAddController(project, $modalInstance, memberResourceSrv, projectRoleResource) {
        var vm = this;
        vm.member = {};
        vm.roles = projectRoleResource.query();
        vm.submit = function () {
            memberResourceSrv.save({"projectId": project.id}, vm.member, function () {
                $modalInstance.close();
            });
        };
    }

    function memberResource($resource) {
        return $resource("/api/project/:projectId/member/:id", {projectId: "projectId", id: "@id"}, {
            page: {url: "/api/project/:projectId/member/page", method: "GET", isArray: false}
        });
    }

    memberListController.$inject = ["project", "$modal", "projectResourceAssembler"];
    memberAddController.$inject = ["project", "$modalInstance", "memberResource", "projectRoleResource"];
    userAutoCompleteCtrl.$inject = ["$http", "$scope"];
    memberResource.$inject = ["$resource"];

    angular.module("kanban.project.configure.member", [])
            .controller("memberListController", memberListController)
            .controller("memberAddController", memberAddController)
            .controller("userAutoCompleteCtrl", userAutoCompleteCtrl)
            .service("memberResource", memberResource);
})();