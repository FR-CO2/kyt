        var config = function ($stateProvider) {
            $stateProvider.state("app.projects", {
                controller: "listProjectAdminController",
                controllerAs: "projectListAdminCtrl",
                templateUrl: "templates/admin/project/list.html",
                url: "project"
            });
            $stateProvider.state("app.project.edit", {
                controller: "editProjectAdminController",
                controllerAs: "projectEditCtrl",
                templateUrl: "templates/admin/project/project.html",
                url: "edit"
            });
            $stateProvider.state("app.project.edit.category", {
                controller: "listCategoryAdminController",
                controllerAs: "categoryListCtrl",
                templateUrl: "templates/admin/project/category/list.html",
                url: "/category"
            });
            $stateProvider.state("app.project.edit.swimlane", {
                controller: "listSwimlaneAdminController",
                controllerAs: "swimlaneListCtrl",
                templateUrl: "templates/admin/project/swimlane/list.html",
                url: "/swimlane"
            });
            $stateProvider.state("app.project.edit.member", {
                controller: "listMemberAdminController",
                controllerAs: "memberListCtrl",
                templateUrl: "templates/admin/project/member/list.html",
                url: "/member"
            });
            $stateProvider.state("app.project.edit.state", {
                controller: "listStateAdminController",
                controllerAs: "stateListCtrl",
                templateUrl: "templates/admin/project/state/list.html",
                url: "/state"
            });
            $stateProvider.state("app.project.edit.taskfield", {
                controller: "listTaskfieldAdminController",
                controllerAs: "taskfieldListCtrl",
                templateUrl: "templates/admin/project/taskfield/list.html",
                url: "/customfield"
            });
            $stateProvider.state("app.project.edit.taskhisto", {
                controller: "listTaskHistoAdminController",
                controllerAs: "taskHistoListCtrl",
                templateUrl: "templates/admin/project/taskhisto/list.html",
                url: "/taskHisto"
            });
        };
        config.$inject = ["$stateProvider"];
        module.exports = config;

