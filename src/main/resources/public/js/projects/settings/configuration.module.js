(function () {
    "use strict";

    function stateListController($stateParams, $modal, stateResourceSrv) {
        var vm = this;
        vm.stateListSortOptions = {
            orderChanged: function (event) {
                var stateUpdated = event.source.itemScope.modelValue;
                var newPosition = event.dest.index;
                stateResourceSrv.updatePosition({projectId: $stateParams.id, id: stateUpdated.id, newPosition: newPosition});
            }
        };
        vm.states = stateResourceSrv.query({"projectId": $stateParams.id});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/states/add.html",
                controller: "stateAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.states = stateResourceSrv.query({"projectId": $stateParams.id});
            });
        };
        vm.delete = function (stateId) {
            stateResourceSrv.delete({projectId: $stateParams.id, id: stateId}, function () {
                vm.states = stateResourceSrv.query({"projectId": $stateParams.id});
            });
        };
    }

    function swimlaneListController($stateParams, $modal, swimlaneResourceSrv) {
        var vm = this;
        vm.swimlaneListSortOptions = {
            orderChanged: function (event) {
                var swimlaneUpdated = event.source.itemScope.modelValue;
                var newPosition = event.dest.index;
                swimlaneResourceSrv.updatePosition({projectId: $stateParams.id, id: swimlaneUpdated.id, newPosition: newPosition});
            }
        };
        vm.swimlanes = swimlaneResourceSrv.query({"projectId": $stateParams.id});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/swimlanes/add.html",
                controller: "swimlaneAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.swimlanes = swimlaneResourceSrv.query({"projectId": $stateParams.id});
            });
        };
        vm.delete = function (swimlaneId) {
            swimlaneResourceSrv.delete({projectId: $stateParams.id, id: swimlaneId}, function () {
                vm.swimlanes = swimlaneResourceSrv.query({"projectId": $stateParams.id});
            });
        };
    }

    function categoryListController($stateParams, $modal, categoryResourceSrv) {
        var vm = this;
        vm.categories = categoryResourceSrv.query({"projectId": $stateParams.id});
        vm.add = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: "templates/projects/categories/add.html",
                controller: "categoryAddController",
                controllerAs: "add",
                size: "md"
            });
            modalInstance.result.then(function () {
                vm.categories = categoryResourceSrv.query({"projectId": $stateParams.id});
            });
        };
        vm.delete = function (categoryId) {
            categoryResourceSrv.delete({projectId: $stateParams.id, id: categoryId}, function () {
                vm.categories = categoryResourceSrv.query({"projectId": $stateParams.id});
            });
        };
        vm.save = function (category) {
            categoryResourceSrv.save({projectId: $stateParams.id, id: category.id}, category, function () {
                vm.categories = categoryResourceSrv.query({"projectId": $stateParams.id});
            });
        };
    }

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

    function stateAddController($stateParams, $modalInstance, stateResourceSrv) {
        var vm = this;
        vm.submit = function () {
            stateResourceSrv.save({"projectId": $stateParams.id}, vm.state, function () {
                $modalInstance.close();
            });
        };
    }

    function swimlaneAddController($stateParams, $modalInstance, swimlaneResourceSrv) {
        var vm = this;
        vm.submit = function () {
            swimlaneResourceSrv.save({"projectId": $stateParams.id}, vm.swimlane, function () {
                $modalInstance.close();
            });
        };
    }

    function categoryAddController($stateParams, $modalInstance, categoryResourceSrv) {
        var vm = this;
        vm.submit = function () {
            categoryResourceSrv.save({"projectId": $stateParams.id}, vm.category, function () {
                $modalInstance.close();
            });
        };
    }

    function memberAddController($stateParams, $modalInstance, memberResourceSrv, userResource, memberRoleResourceSrv) {
        var vm = this;
        vm.users = userResource.query();
        vm.roles = memberRoleResourceSrv.query({"projectId": $stateParams.id});
        vm.submit = function () {
            memberResourceSrv.save({"projectId": $stateParams.id}, vm.member, function () {
                $modalInstance.close();
            });
        };
    }

    function categoryResource($resource) {
        return $resource("/api/project/:projectId/category/:id", {projectId: "projectId", id: "@id"});
    }

    function memberResource($resource) {
        return $resource("/api/project/:projectId/member/:id", {projectId: "projectId", id: "@id"}, {
            page: {url: "/api/project/:projectId/member/page", method: "GET", isArray: false}
        });
    }

    function memberRoleResource($resource) {
        return $resource("/api/project/:projectId/memberrole", {projectId: "projectId"});
    }


    function taskStateResource($resource) {
        return $resource("/api/project/:projectId/state/:id", {projectId: "@id", id: "@id"}, {
            updatePosition: {
                url: "/api/project/:projectId/state/:id/position/:newPosition",
                method: "POST",
                params: {projectId: "@projectId", id: "@id", newPosition: "@newPosition"}
            },
            kanban: {method: "GET", isArray: true, params: {projectId: "@id", id: "kanban"}}
        });
    }

    function swimlaneResource($resource) {
        return $resource("/api/project/:projectId/swimlane/:id", {projectId: "@id", id: "@id"}, {
            updatePosition: {
                url: "/api/project/:projectId/swimlane/:id/position/:newPosition",
                method: "POST",
                params: {projectId: "@projectId", id: "@id", newPosition: "@newPosition"}
            }
        });
    }

    function projectSettingsConfig($stateProvider) {
        $stateProvider.state("app.project-detail.configure", {
            templateUrl: "templates/projects/configure-layout.html",
            url: "/configure"
        });
        $stateProvider.state("app.project-detail.configure.state", {
            templateUrl: "/templates/projects/states/list.html",
            controller: "stateListController",
            controllerAs: "configStateCtrl",
            url: "/state"
        });
        $stateProvider.state("app.project-detail.configure.swimlane", {
            templateUrl: "/templates/projects/swimlanes/list.html",
            controller: "swimlaneListController",
            controllerAs: "configCtrl",
            url: "/swimlane"
        });
        $stateProvider.state("app.project-detail.configure.member", {
            templateUrl: "templates/projects/members/list.html",
            controller: "memberListController",
            controllerAs: "configMemberCtrl",
            url: "/member"
        });
        $stateProvider.state("app.project-detail.configure.category", {
            templateUrl: "templates/projects/categories/list.html",
            controller: "categoryListController",
            controllerAs: "configCategoryCtrl",
            url: "/category"
        });
    }

    projectSettingsConfig.$inject = ["$stateProvider"];
    stateListController.$inject = ["$stateParams", "$modal", "taskStateResource"];
    stateAddController.$inject = ["$stateParams", "$modalInstance", "taskStateResource"];
    swimlaneListController.$inject = ["$stateParams", "$modal", "swimlaneResource"];
    swimlaneAddController.$inject = ["$stateParams", "$modalInstance", "swimlaneResource"];
    categoryListController.$inject = ["$stateParams", "$modal", "categoryResource"];
    memberListController.$inject = ["$stateParams", "$modal", "memberResource"];
    categoryAddController.$inject = ["$stateParams", "$modalInstance", "categoryResource"];
    memberAddController.$inject = ["$stateParams", "$modalInstance", "memberResource", "userResource", "memberRoleResource"];
    categoryResource.$inject = ["$resource"];
    memberResource.$inject = ["$resource"];
    memberRoleResource.$inject = ["$resource"];
    taskStateResource.$inject = ["$resource"];
    swimlaneResource.$inject = ["$resource"];

    angular.module("kanban.project.configure", [])
            .config(projectSettingsConfig)
            .controller("stateListController", stateListController)
            .controller("stateAddController", stateAddController)
            .controller("swimlaneListController", swimlaneListController)
            .controller("swimlaneAddController", swimlaneAddController)
            .controller("categoryListController", categoryListController)
            .controller("memberListController", memberListController)
            .controller("categoryAddController", categoryAddController)
            .controller("memberAddController", memberAddController)
            .service("categoryResource", categoryResource)
            .service("memberResource", memberResource)
            .service("memberRoleResource", memberRoleResource)
            .service("taskStateResource", taskStateResource)
            .service("swimlaneResource", swimlaneResource);

})();

