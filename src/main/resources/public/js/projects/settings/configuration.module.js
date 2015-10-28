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

    function swimlaneListController($stateParams, $modal, swimlaneResourceSrv, memberResourceSrv) {
        var vm = this;
        vm.swimlaneListSortOptions = {
            orderChanged: function (event) {
                var swimlaneUpdated = event.source.itemScope.modelValue;
                var newPosition = event.dest.index;
                swimlaneResourceSrv.updatePosition({projectId: $stateParams.id, id: swimlaneUpdated.id, newPosition: newPosition});
            }
        };
        vm.swimlanes = swimlaneResourceSrv.query({"projectId": $stateParams.id});
        vm.loadMember = function () {
            vm.members = memberResourceSrv.query({"projectId": $stateParams.id});
        };
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
        vm.save = function (swimlane) {
            swimlaneResourceSrv.updateResponable({projectId: $stateParams.id, id: swimlane.id, newResponsable: swimlane.responsable.id}, function () {
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


    function stateAddController($stateParams, $modalInstance, stateResourceSrv) {
        var vm = this;
        vm.submit = function () {
            stateResourceSrv.save({"projectId": $stateParams.id}, vm.state, function () {
                $modalInstance.close();
            });
        };
    }

    function swimlaneAddController($stateParams, $modalInstance, swimlaneResourceSrv, memberResourceSrv) {
        var vm = this;
        vm.members = memberResourceSrv.query({"projectId": $stateParams.id});
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


    function categoryResource($resource) {
        return $resource("/api/project/:projectId/category/:id", {projectId: "projectId", id: "@id"});
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
            },
            updateResponable: {
                url: "/api/project/:projectId/swimlane/:id/responsable/:newResponsable",
                method: "POST",
                params: {projectId: "@projectId", id: "@id", newResponsable: "@newResponsable"}
            }
        });
    }

    function projectSettingsConfig($stateProvider) {
        $stateProvider.state("app.project.configure", {
            templateUrl: "templates/projects/configure-layout.html",
            url: "/configure"
        });
        $stateProvider.state("app.project.configure.state", {
            templateUrl: "/templates/projects/states/list.html",
            controller: "stateListController",
            controllerAs: "configStateCtrl",
            url: "/state"
        });
        $stateProvider.state("app.project.configure.swimlane", {
            templateUrl: "/templates/projects/swimlanes/list.html",
            controller: "swimlaneListController",
            controllerAs: "configCtrl",
            url: "/swimlane"
        });

        $stateProvider.state("app.project.configure.category", {
            templateUrl: "templates/projects/categories/list.html",
            controller: "categoryListController",
            controllerAs: "configCategoryCtrl",
            url: "/category"
        });
        $stateProvider.state("app.project.configure.member", {
            templateUrl: "templates/projects/members/list.html",
            controller: "memberListController",
            controllerAs: "configMemberCtrl",
            url: "/member"
        });
    }

    projectSettingsConfig.$inject = ["$stateProvider"];
    stateListController.$inject = ["$stateParams", "$modal", "taskStateResource"];
    stateAddController.$inject = ["$stateParams", "$modalInstance", "taskStateResource"];
    swimlaneListController.$inject = ["$stateParams", "$modal", "swimlaneResource", "memberResource"];
    swimlaneAddController.$inject = ["$stateParams", "$modalInstance", "swimlaneResource", "memberResource"];
    categoryListController.$inject = ["$stateParams", "$modal", "categoryResource"];
    categoryAddController.$inject = ["$stateParams", "$modalInstance", "categoryResource"];
    categoryResource.$inject = ["$resource"];
    taskStateResource.$inject = ["$resource"];
    swimlaneResource.$inject = ["$resource"];

    angular.module("kanban.project.configure", ["kanban.project.configure.member"])
            .config(projectSettingsConfig)
            .controller("stateListController", stateListController)
            .controller("stateAddController", stateAddController)
            .controller("swimlaneListController", swimlaneListController)
            .controller("swimlaneAddController", swimlaneAddController)
            .controller("categoryListController", categoryListController)
            .controller("categoryAddController", categoryAddController)
            .service("categoryResource", categoryResource)
            .service("taskStateResource", taskStateResource)
            .service("swimlaneResource", swimlaneResource);

})();

