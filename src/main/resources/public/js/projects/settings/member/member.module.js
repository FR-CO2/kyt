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

    function memberListController($stateParams, $modal, memberResourceSrv) {
        var vm = this;
        vm.nbElt = 10;
        vm.numPage = 1;
        vm.paging = {
            size: vm.nbElt,
            page: 0
        };
        vm.members = memberResourceSrv.page({"projectId": $stateParams.id, size: vm.paging.size, page: vm.paging.page});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/members/add.html",
                controller: "memberAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.members = memberResourceSrv.page({"projectId": $stateParams.id, size: vm.paging.size, page: vm.paging.page});
            });
        };
        vm.delete = function (memberId) {
            memberResourceSrv.delete({projectId: $stateParams.id, id: memberId}, function () {
                vm.members = memberResourceSrv.page({"projectId": $stateParams.id, size: vm.paging.size, page: vm.paging.page});
            });
        };
        vm.pageChanged = function () {
            if (vm.nbElt !== vm.paging.size) {
                vm.numPage = 1;
            }
            ;
            vm.paging = {
                size: vm.nbElt,
                page: vm.numPage - 1
            };
            vm.members = memberResourceSrv.page({projectId: $stateParams.id, size: vm.paging.size, page: vm.paging.page}, function (result) {
                vm.numPage = result.number + 1;
            });
        };
    }


    function memberAddController($stateParams, $modalInstance, memberResourceSrv, userResource, memberRoleResourceSrv) {
        var vm = this;
        vm.member = {};
        vm.users = userResource.query();
        vm.roles = memberRoleResourceSrv.query({"projectId": $stateParams.id});
        vm.submit = function () {
            memberResourceSrv.save({"projectId": $stateParams.id}, vm.member, function () {
                $modalInstance.close();
            });
        };
    }


    function memberRoleResource($resource) {
        return $resource("/api/project/:projectId/memberrole", {projectId: "projectId"});
    }

    function memberResource($resource) {
        return $resource("/api/project/:projectId/member/:id", {projectId: "projectId", id: "@id"}, {
            page: {url: "/api/project/:projectId/member/page", method: "GET", isArray: false}
        });
    }

    memberListController.$inject = ["$stateParams", "$modal", "memberResource"];
    memberAddController.$inject = ["$stateParams", "$modalInstance", "memberResource", "userResource", "memberRoleResource"];
    userAutoCompleteCtrl.$inject = ["$http", "$scope"];
    memberRoleResource.$inject = ["$resource"];
    memberResource.$inject = ["$resource"];

    angular.module("kanban.project.configure.member", [])
            .controller("memberListController", memberListController)
            .controller("memberAddController", memberAddController)
            .controller("userAutoCompleteCtrl", userAutoCompleteCtrl)
            .service("memberResource", memberResource)
            .service("memberRoleResource", memberRoleResource);
})();