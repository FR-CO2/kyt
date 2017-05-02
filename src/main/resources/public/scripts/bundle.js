(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var projectModule = require("./project/project.module");
var userModule = require("./user/user.module");
module.exports = angular.module('kanban.admin', [projectModule.name, userModule.name]);

},{"./project/project.module":12,"./user/user.module":28}],2:[function(require,module,exports){
var addController = function ($uibModalInstance, projects) {
    var vm = this;
    vm.submit = function () {
        projects.resource("self").save(vm.project, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "projects"];
module.exports = addController;

},{}],3:[function(require,module,exports){
var addController = function ($uibModalInstance, project) {
    var vm = this;
    vm.submit = function () {
        project.resource("category").save(vm.category, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project"];
module.exports = addController;

},{}],4:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.category', []).controller("listCategoryAdminController", listController).controller("addCategoryAdminController", addController);

},{"./add.controller":3,"./list.controller":5}],5:[function(require,module,exports){
var listController = function ($uibModal, project) {
    var vm = this;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/category/add.html",
            controller: "addCategoryAdminController",
            controllerAs: "addCategoryCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (category) {
        category.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.saveCategory = function (category) {
        var result = category.resource("self").save(category).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.categories = project.resource("category").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project"];
module.exports = listController;

},{}],6:[function(require,module,exports){
var editController = function ($state, project) {
    var vm = this;
    vm.project = project;
    $state.transitionTo("app.project.edit.taskfield", { projectId: project.id });
};
editController.$inject = ["$state", "project"];
module.exports = editController;

},{}],7:[function(require,module,exports){
var listController = function ($uibModal, scope, projectService, HateoasInterface) {
    var vm = this;
    function loadPage() {
        return projectService.get({ page: vm.projects.page.number, size: vm.projects.page.size }, function () {
            if (vm.projects._embedded) {
                angular.forEach(vm.projects._embedded.projectResourceList, function (project) {
                    project.states = new HateoasInterface(project).resource("state").query();
                    return project;
                });
            }
        });
    }
    vm.projects = {
        page: {
            number: 0,
            size: 15
        }
    };
    vm.projects = loadPage();
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/add.html",
            controller: "addProjectAdminController",
            controllerAs: "addProjectCtrl",
            resolve: {
                projects: vm.projects
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            scope.$emit("kanban:projects-updates");
            vm.projects = loadPage();
        });
    };
    vm.delete = function (project) {
        new HateoasInterface(project).resource("self").delete(function () {
            scope.$emit("kanban:projects-updates");
            vm.projects = loadPage();
        });
    };
};
listController.$inject = ["$uibModal", "$scope", "projectService", "HateoasInterface"];
module.exports = listController;

},{}],8:[function(require,module,exports){
var addController = function ($uibModalInstance, userService, project) {
    var vm = this;
    vm.selectUser = function ($item, $model, $label) {
        vm.member.user = $model;
    };
    vm.getUsers = function (term) {
        return userService.query({ search: term }).$promise;
    };
    vm.projectRoles = project.resource("roles").query();
    vm.submit = function () {
        project.resource("member").save(vm.member, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "userService", "project"];
module.exports = addController;

},{}],9:[function(require,module,exports){
var listController = function ($uibModal, project, HateoasInterface) {
    var vm = this;
    vm.projectRoles = project.resource("roles").query();
    vm.members = {
        page: {
            number: 0,
            size: 15
        }
    };
    vm.members = project.resource("member").get({ page: vm.members.page.number,
        size: vm.members.page.size });
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/member/add.html",
            controller: "addMemberAdminController",
            controllerAs: "addMemberCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.members = project.resource("member").get({ page: vm.members.page.number,
                size: vm.members.page.size });
        });
    };
    vm.delete = function (member) {
        new HateoasInterface(member).resource("self").delete(null, function () {
            vm.members = project.resource("member").get({ page: vm.members.page.number,
                size: vm.members.page.size });
        });
    };
    vm.saveMember = function (member) {
        var result = new HateoasInterface(member).resource("self").save(member).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
};
listController.$inject = ["$uibModal", "project", "HateoasInterface"];
module.exports = listController;

},{}],10:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.member', []).controller("listMemberAdminController", listController).controller("addMemberAdminController", addController);

},{"./add.controller":8,"./list.controller":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
var stateModule = require("./state/state.module");
var categoryModule = require("./category/category.module");
var swimlaneModule = require("./swimlane/swimlane.module");
var memberModule = require("./member/member.module");
var taskfieldModule = require("./taskfield/taskfield.module");
var taskHistoModule = require("./taskhisto/taskhisto.module");
var config = require("./project.config");
var listController = require("./list.controller");
var addController = require("./add.controller");
var editController = require("./edit.controller");
module.exports = angular.module('kanban.admin.project', ["kanban.project", stateModule.name, categoryModule.name, swimlaneModule.name, memberModule.name, taskfieldModule.name, taskHistoModule.name]).config(config).controller("listProjectAdminController", listController).controller("addProjectAdminController", addController).controller("editProjectAdminController", editController);

},{"./add.controller":2,"./category/category.module":4,"./edit.controller":6,"./list.controller":7,"./member/member.module":10,"./project.config":11,"./state/state.module":15,"./swimlane/swimlane.module":18,"./taskfield/taskfield.module":22,"./taskhisto/taskhisto.module":24}],13:[function(require,module,exports){
var addController = function ($uibModalInstance, project) {
    var vm = this;
    vm.submit = function () {
        project.resource("state").save(vm.state, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project"];
module.exports = addController;

},{}],14:[function(require,module,exports){
var listController = function ($uibModal, project, growl) {
    var vm = this;
    vm.stateListSortOptions = {
        orderChanged: function (event) {
            var stateUpdated = event.source.itemScope.modelValue;
            var newPosition = event.dest.index;
            stateUpdated.position = newPosition;
            stateUpdated.resource("self").save(null, stateUpdated);
        }
    };
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/state/add.html",
            controller: "addStateAdminController",
            controllerAs: "addStateCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (state) {
        state.resource("self").delete(null, function () {
            vm.reload();
        }, function (error) {
            growl.error(error.data.message);
        });
    };
    vm.saveState = function (state) {
        var result = state.resource("self").save(state).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.states = project.resource("state").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project", "growl"];
module.exports = listController;

},{}],15:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.state', ['angular-growl']).controller("listStateAdminController", listController).controller("addStateAdminController", addController);

},{"./add.controller":13,"./list.controller":14}],16:[function(require,module,exports){
var addController = function ($uibModalInstance, project) {
    var vm = this;
    vm.submit = function () {
        project.resource("swimlane").save(vm.swimlane, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project"];
module.exports = addController;

},{}],17:[function(require,module,exports){

var listController = function ($uibModal, project, moment) {
    var vm = this;
    vm.swimlaneListSortOptions = {
        orderChanged: function (event) {
            var swimlaneUpdated = event.source.itemScope.modelValue;
            var newPosition = event.dest.index;
            swimlaneUpdated.position = newPosition;
            swimlaneUpdated.resource("self").save(null, swimlaneUpdated);
        }
    };
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/swimlane/add.html",
            controller: "addSwimlaneAdminController",
            controllerAs: "addSwimlaneCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (swimlane) {
        swimlane.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.saveSwimlane = function (swimlane) {
        var result = swimlane.resource("self").save(swimlane).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.swimlanes = project.resource("swimlane").query();
        vm.swimlanes.$promise.then(function (data) {
            angular.forEach(data, function (swimlane) {
                if (swimlane.endPlanned) {
                    swimlane.endPlanned = moment(swimlane.endPlanned).toDate();
                }
            });
        });
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project", "moment"];
module.exports = listController;

},{}],18:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.admin.project.swimlane', []).controller("listSwimlaneAdminController", listController).controller("addSwimlaneAdminController", addController);

},{"./add.controller":16,"./list.controller":17}],19:[function(require,module,exports){
var addController = function ($uibModalInstance, project, fieldtypeService) {
    var vm = this;
    vm.fieldTypes = fieldtypeService.query();
    vm.submit = function () {
        project.resource("taskfield").save(vm.taskfield, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project", "fieldtypeService"];
module.exports = addController;

},{}],20:[function(require,module,exports){
var fieldTypeService = function ($resource) {
    return $resource("/api/taskfieldtype");
};
fieldTypeService.$inject = ["$resource"];
module.exports = fieldTypeService;

},{}],21:[function(require,module,exports){
var listController = function ($uibModal, project) {
    var vm = this;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/project/taskfield/add.html",
            controller: "addTaskfieldAdminController",
            controllerAs: "addTaskfieldCtrl",
            resolve: {
                project: project
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.reload();
        });
    };
    vm.delete = function (taskfield) {
        taskfield.resource("self").delete(null, function () {
            vm.reload();
        });
    };
    vm.reload = function () {
        vm.taskfields = project.resource("taskfield").query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "project"];
module.exports = listController;

},{}],22:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
var fieldtypeSrv = require("./fieldtype.service");
module.exports = angular.module('kanban.admin.project.taskfield', []).service("fieldtypeService", fieldtypeSrv).controller("listTaskfieldAdminController", listController).controller("addTaskfieldAdminController", addController);

},{"./add.controller":19,"./fieldtype.service":20,"./list.controller":21}],23:[function(require,module,exports){
var listController = function (project) {
    var vm = this;
    vm.reload = function () {
        vm.taskshisto = project.resource("task").query();
    };
    vm.reload();
};
listController.$inject = ["project"];
module.exports = listController;

},{}],24:[function(require,module,exports){
var listController = require("./list.controller");
module.exports = angular.module('kanban.admin.project.taskhisto', []).controller("listTaskHistoAdminController", listController);

},{"./list.controller":23}],25:[function(require,module,exports){
var addController = function ($uibModalInstance, userRoleService, userService) {
    var vm = this;
    vm.roles = userRoleService.query();
    vm.submit = function () {
        if (!vm.error) {
            userService.save(vm.user, function () {
                $uibModalInstance.close();
            }, function (error) {
                vm.error = error.data;
            });
        }
    };
};
addController.$inject = ["$uibModalInstance", "userRoleService", "userService"];
module.exports = addController;

},{}],26:[function(require,module,exports){
var listController = function ($uibModal, HateoasInterface, userService, userRoleService) {
    var vm = this;
    vm.users = {
        page: {
            number: 0,
            size: 15
        }
    };
    vm.userRoles = userRoleService.query();
    vm.users = userService.get({ page: vm.users.page.number,
        size: vm.users.page.size });
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/admin/user/add.html",
            controller: "addUserAdminController",
            controllerAs: "addUserAdminCtrl",
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.users = userService.get({ page: vm.users.page.number,
                size: vm.users.page.size });
        });
    };
    vm.delete = function (user) {
        new HateoasInterface(user).resource("self").delete(null, function () {
            vm.users = userService.get({ page: vm.users.page.number,
                size: vm.users.page.size });
        });
    };
    vm.saveUser = function (user) {
        return new HateoasInterface(user).resource("self").save(user).$promise;
    };
};
listController.$inject = ["$uibModal", "HateoasInterface", "userService", "userRoleService"];
module.exports = listController;

},{}],27:[function(require,module,exports){
var config = function ($stateProvider) {
    $stateProvider.state("app.users", {
        templateUrl: "templates/admin/user/list.html",
        controller: "listUserAdminController",
        controllerAs: "usersCtrl",
        url: "users"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

},{}],28:[function(require,module,exports){
var config = require("./user.config");
var listController = require("./list.controller");
var addController = require("./add.controller");
var userService = require("./user.service");
var userRoleService = require("./userrole.service");
module.exports = angular.module('kanban.admin.user', []).config(config).controller("listUserAdminController", listController).controller("addUserAdminController", addController).service("userService", userService).service("userRoleService", userRoleService);

},{"./add.controller":25,"./list.controller":26,"./user.config":27,"./user.service":29,"./userrole.service":30}],29:[function(require,module,exports){
var userService = function ($resource) {
    return $resource("/api/user");
};
userService.$inject = ["$resource"];
module.exports = userService;

},{}],30:[function(require,module,exports){
var userRoleService = function ($resource) {
    return $resource("/api/role");
};
userRoleService.$inject = ["$resource"];
module.exports = userRoleService;

},{}],31:[function(require,module,exports){

function authTokenHttpInterceptor($sessionStorage) {
    return {
        "request": function (config) {
            if (config.url && config.url.indexOf(".html") === -1 && $sessionStorage.oauth) {
                config.headers.authorization = $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token;
                config.withCredentials = true;
            }
            return config;
        }
    };
}
;
authTokenHttpInterceptor.$inject = ["$sessionStorage"];

var config = function ($stateProvider, $httpProvider, HateoasInterceptorProvider) {
    $stateProvider.state("app", {
        abstract: true,
        templateUrl: "layout-app.html",
        controller: "appController",
        controllerAs: "appCtrl",
        url: "/",
        resolve: {
            currentuser: ["currentUserService", function (currentUserService) {
                return currentUserService.get();
            }],
            appParameters: ["parameterService", function (parameterService) {
                return parameterService.query();
            }]
        }
    });
    $stateProvider.state("app.dashboard", {
        templateUrl: "templates/dashboard/dashboard.html",
        controller: "dashboardController",
        controllerAs: "dashboardCtrl",
        url: "dashboard"
    });
    $stateProvider.state("app.profil", {
        templateUrl: "templates/profil/profil.html",
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
    $httpProvider.interceptors.push(authTokenHttpInterceptor);
    HateoasInterceptorProvider.transformAllResponses();
};
config.$inject = ["$stateProvider", "$httpProvider", "HateoasInterceptorProvider"];

module.exports = config;

},{}],32:[function(require,module,exports){
var appController = function ($http, currentuser, scope, $sessionStorage, $state) {
    var vm = this;
    vm.currentuser = currentuser;
    currentuser.$promise.then(function () {
        currentuser.projects = currentuser.resource("project").query();
        if (currentuser._links.photo) {
            $http.get(currentuser._links.photo).then(function (result) {
                currentuser.photo = result.data;
            });
        }
        ;
    });
    vm.redirectTask = function ($item, $model, $label) {
        project = currentuser.resource("project").query({ taskId: $model.id }).$promise;
        project.then(function () {
            $state.transitionTo("app.project.task", { projectId: project.$$state.value[0].id, taskId: $model.id });
        });
        vm.searchedTask = null;
    };
    vm.getTasks = function (term) {
        return currentuser.resource("search").query({ search: term }).$promise;
    };

    vm.logout = function () {
        delete $sessionStorage.oauth;
        $state.transitionTo("login");
    };
    scope.$on("kanban:projects-updates", function () {
        currentuser.projects = currentuser.resource("project").query();
    });
};
appController.$inject = ["$http", "currentuser", "$scope", "$sessionStorage", "$state"];

module.exports = appController;

},{}],33:[function(require,module,exports){

var appConfig = require("./app.config");
var appRun = require("./app.run");
var loginModule = require("./login/login.module");
var appController = require("./app.controller");
var dashboardModule = require("./dashboard/dashboard.module");
var projectModule = require("./project/project.module");
var samePasswordDirective = require("./directive/samePassword.directive");
var checkboxFilterDirective = require("./directive/checkboxfilter.directive");
var errorDirective = require("./directive/error.directive");
var togglerDirective = require("./directive/toggler.directive");
var adminModule = require("./admin/admin.module");
var profilController = require("./profil/profil.controller");
var parameterModule = require("./parameter/parameter.module");

angular.module("kanban", ["ui.router", "ngStorage", "ngSanitize", "ui.sortable", "angularMoment", "http-auth-interceptor", "xeditable", "ngResource", "hateoas", "ui.bootstrap", "ui.bootstrap.tpls", "ngImgCrop", "textAngular", "infinite-scroll", loginModule.name, dashboardModule.name, projectModule.name, adminModule.name, parameterModule.name]).config(appConfig).run(appRun).controller("appController", appController).controller("profilController", profilController).directive("checkboxFilter", checkboxFilterDirective).directive("samePassword", samePasswordDirective).directive("errors", errorDirective).directive("toggler", togglerDirective);

},{"./admin/admin.module":1,"./app.config":31,"./app.controller":32,"./app.run":34,"./dashboard/dashboard.module":37,"./directive/checkboxfilter.directive":38,"./directive/error.directive":39,"./directive/samePassword.directive":40,"./directive/toggler.directive":41,"./login/login.module":45,"./parameter/parameter.module":49,"./profil/profil.controller":51,"./project/project.module":66}],34:[function(require,module,exports){
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var appRun = function ($rootScope, $sessionStorage, $state, $uibModal, authService, editableOptions) {
    editableOptions.theme = 'bs3';
    $rootScope.loginOngoing = false;
    $rootScope.$on("event:auth-forbidden", function () {
        $state.go("app.dashboard");
    });
    $rootScope.$on("event:auth-loginRequired", function () {
        delete $sessionStorage.oauth;
        var modalScope = $rootScope.$new();
        if (!$rootScope.loginOngoing) {
            $rootScope.loginOngoing = true;
            modalScope.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: "login.html",
                controller: "loginController",
                controllerAs: "login",
                scope: modalScope,
                keyboard: false,
                size: "md"
            });
            modalScope.modalInstance.result.then(function () {
                authService.loginConfirmed();
                $rootScope.loginOngoing = false;
            });
        }
    });
    $state.go("login");
};
appRun.$inject = ["$rootScope", "$sessionStorage", "$state", "$uibModal", "authService", "editableOptions"];
module.exports = appRun;

},{}],35:[function(require,module,exports){
var addController = function ($uibModalInstance, allocationService, day, currentuser, appParameters) {
    var vm = this;
    vm.day = day;
    vm.allocations = allocationService.loadAllocation(appParameters);
    // need to multipy by 1000 for get UNIX Timestamp
    vm.imputations = currentuser.resource("consommation").query({ date: day.format("X") * 1000 });
    vm.addTask = function ($item, $model, $label) {
        var newImputation = {
            taskName: $model.name,
            taskId: $model.id,
            timeRemains: $model.timeRemains,
            timeSpent: 0
        };
        var taskAlreadyAdded = false;
        angular.forEach(vm.imputations, function (imputation) {
            if (newImputation.taskId === imputation.taskId) {
                taskAlreadyAdded = true;
            }
        });
        if (!taskAlreadyAdded) {
            vm.imputations.push(newImputation);
        }
        vm.addedTask = null;
    };
    vm.getTasks = function (term) {
        return currentuser.resource("task").query({ search: term }).$promise;
    };
    vm.submit = function () {
        // need to multipy by 1000 for get UNIX Timestamp
        currentuser.resource("consommation").save({ date: day.format("X") * 1000 }, vm.imputations, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "allocationService", "day", "currentuser", "appParameters"];
module.exports = addController;

},{}],36:[function(require,module,exports){

var dashboardController = function ($uibModal, HateoasInterface, currentuser, taskAssemblerService, uiCalendarConfig, moment, appParameters) {
    var vm = this;
    vm.tasks = {
        page: {
            size: 10,
            number: 1
        }
    };
    var load = function () {
        currentuser.$promise.then(function () {
            vm.tasks = currentuser.resource("task").get({
                page: vm.tasks.page.number - 1,
                size: vm.tasks.page.size
            }, function (data) {
                if (data._embedded) {
                    angular.forEach(data._embedded.taskResourceList, function (task) {
                        task = taskAssemblerService(task);
                        task.project = new HateoasInterface(task).resource("project").get();
                    });
                }
                data.page.number++;
                return data;
            });
            vm.calendarOptions = {
                height: 450,
                editable: false,
                lang: "fr",
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                viewRender: function (view, element) {
                    var start = moment(view.start);
                    var end = moment(view.end);
                    // need to multipy by 1000 for get UNIX Timestamp
                    vm.loadCalendarEvent(start.format("X") * 1000, end.format("X") * 1000);
                },
                dayClick: dayOnClick
            };
        });
    };
    vm.loadCalendarEvent = function (start, end) {
        currentuser.resource("task").query({ start: start, end: end }, function (data) {
            angular.forEach(data, function (task) {
                task = taskAssemblerService(task);
                task.title = task.name;
                task.start = moment(task.plannedStart).toDate();
                task.end = moment(task.plannedEnding).toDate();
                task.allDay = true;
                if (task._links.category) {
                    task.category.$promise.then(function () {
                        task.backgroundColor = task.category.bgcolor;
                        uiCalendarConfig.calendars.userCalendar.fullCalendar('renderEvent', task);
                    });
                } else {
                    uiCalendarConfig.calendars.userCalendar.fullCalendar('renderEvent', task);
                }
            });
        });
    };
    currentuser.$promise.then(load);
    dayOnClick = function (day) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/dashboard/calendar/imputation.html",
            controller: "addImputationController",
            controllerAs: "addImputationCtrl",
            resolve: {
                day: function () {
                    return day;
                },
                currentuser: function () {
                    return currentuser;
                },
                appParameters: function () {
                    return appParameters;
                }
            },
            size: "md"
        });
        modalInstance.result.then(load);
    };
    vm.eventsSource = [];
};
dashboardController.$inject = ["$uibModal", "HateoasInterface", "currentuser", "taskAssemblerService", "uiCalendarConfig", "moment", "appParameters"];
module.exports = dashboardController;

},{}],37:[function(require,module,exports){
var dashboardController = require("./dashboard.controller");
var addImputationController = require("./calendar/addimputation.controller");
module.exports = angular.module('kanban.dashboard', ["ui.calendar"]).controller("dashboardController", dashboardController).controller("addImputationController", addImputationController);

},{"./calendar/addimputation.controller":35,"./dashboard.controller":36}],38:[function(require,module,exports){
module.exports = function () {
    return {
        restrict: "E",
        transclude: true,
        scope: { filterTitle: '@' },
        template: '<div class="checkboxDropdown">' + '<button class="btn btn-sm" ng-click="toggle()"> {{filterTitle}} <span class="caret"></span></button>' + '<div class="checkboxDropdown__filters" ng-class="{\'checkboxDropdown__filters--show\': toggled}"><ng-transclude></ng-transclude></div>' + '</div>',
        link: function (scope, elem, attrs) {
            scope.toggled = false;
            scope.toggle = function () {
                scope.toggled = !scope.toggled;
            };
        }
    };
};

},{}],39:[function(require,module,exports){
module.exports = function () {
    return {
        restrict: "E",
        scope: {
            errors: "=errors"
        },
        template: '<ul> ' + '<li ng-repeat="msg in errors.messages">' + '{{msg.message}}' + '</li>' + '</ul>'
    };
};

},{}],40:[function(require,module,exports){

var checkSamePassword = function (password, rePassword) {
    var error = null;
    if (rePassword !== '' && password !== undefined && rePassword !== password) {
        error = {
            message: "Les mots de passe saisis ne correspondent pas"
        };
    }
    return error;
};
module.exports = function () {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            password: "=password",
            placeholder: "@placeholder",
            error: "=error"
        },
        link: function (scope, elem, attrs, ctrl) {
            var rePasswordElm = elem.children()[0];
            elem.add(scope.password).on('keyup', function () {
                scope.error = checkSamePassword(scope.password, rePasswordElm.value);
                scope.$apply();
            });
            scope.$watch('password', function () {
                if (rePasswordElm.value) {
                    scope.error = checkSamePassword(scope.password, rePasswordElm.value);
                }
            });
        },
        template: '<input type="password" class="form-control" id="rePassword" placeholder="{{placeholder}}"/>'
    };
};

},{}],41:[function(require,module,exports){

module.exports = function () {
    return {
        restrict: "A",
        scope: {
            toggleClass: '@',
            toggleActive: '='
        },
        link: function (scope, elem) {
            if (scope.toggleActive) {
                angular.element(elem).on('click', function () {
                    angular.element(elem).parent().toggleClass(scope.toggleClass);
                });
            }
        }
    };
};

},{}],42:[function(require,module,exports){
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var appAuthService = function appAuthService($http) {
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
};
appAuthService.$inject = ["$http"];
module.exports = appAuthService;

},{}],43:[function(require,module,exports){
var userProfile = function ($resource) {
    return $resource("/api/userProfile");
};
userProfile.$inject = ["$resource"];
module.exports = userProfile;

},{}],44:[function(require,module,exports){
var loginController = function (scope, $state, $sessionStorage, appAuthService) {
    var vm = this;
    vm.authenticate = function () {
        appAuthService.login(vm.loginForm).success(function (result) {
            $sessionStorage.oauth = result;
            if (scope.modalInstance) {
                scope.modalInstance.close();
            }
            $state.transitionTo("app.dashboard");
        }).error(function () {
            vm.loginForm = {};
            vm.loginForm.error = "Login/password invalide";
        });
    };
};
loginController.$inject = ["$scope", "$state", "$sessionStorage", "appAuthService"];
module.exports = loginController;

},{}],45:[function(require,module,exports){
var loginController = require("./login.controller");
var appAuthService = require("./auth.service");
var currentUserService = require("./currentuser.service");
module.exports = angular.module('kanban.login', []).controller("loginController", loginController).service("appAuthService", appAuthService).service("currentUserService", currentUserService);

},{"./auth.service":42,"./currentuser.service":43,"./login.controller":44}],46:[function(require,module,exports){
var allocationService = function () {
    return {
        loadAllocation: function (appParameters) {
            var allocations = {};
            for (var i = 0; i < appParameters.length; i++) {
                if (appParameters[i].category === 'ALLOCATION') {
                    for (var j = 0; j < appParameters[i].parameter.length; j++) {
                        allocations[appParameters[i].parameter[j].keyParam] = appParameters[i].parameter[j].valueParam;
                    }
                    break;
                }
            }
            return allocations;
        }
    };
};
allocationService.$inject = [];
module.exports = allocationService;

},{}],47:[function(require,module,exports){

var listController = function ($uibModal, parameterService) {
    var vm = this;
    vm.saveParameter = function (parameter) {
        var result = parameterService.save(parameter).$promise;
        result.catch(function (error) {
            error.data = error.data.message;
        });
        return result;
    };
    vm.reload = function () {
        vm.parameters = parameterService.query();
    };
    vm.reload();
};
listController.$inject = ["$uibModal", "parameterService"];
module.exports = listController;

},{}],48:[function(require,module,exports){
var config = function ($stateProvider) {
    $stateProvider.state("app.parameter", {
        templateUrl: "templates/admin/parameter/list.html",
        controller: "listParameterAdminController",
        controllerAs: "parameterCtrl",
        url: "parameter"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

},{}],49:[function(require,module,exports){
var config = require("./parameter.config");
var listController = require("./list.controller");
var parameterService = require("./parameter.service");
var allocationService = require("./allocation.service");
module.exports = angular.module('kanban.parameter', []).config(config).controller("listParameterAdminController", listController).service("parameterService", parameterService).service("allocationService", allocationService);

},{"./allocation.service":46,"./list.controller":47,"./parameter.config":48,"./parameter.service":50}],50:[function(require,module,exports){
var parameterService = function ($resource) {
    return $resource("/api/parameter/:category/:key", { category: "@category", key: "@keyParam" });
};
parameterService.$inject = ["$resource"];
module.exports = parameterService;

},{}],51:[function(require,module,exports){
var profilController = function (scope, $http, currentuser) {
    var vm = this;
    vm.newPhoto = '';
    currentuser.$promise.then(function () {
        vm.profil = currentuser;
        if (currentuser._links.member) {
            vm.profil.members = currentuser.resource("member").query();
        }
    });
    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            scope.$apply(function () {
                vm.photoTemp = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#photoProfil')).on('change', handleFileSelect);
    vm.save = function () {
        if (!vm.error) {
            var formData = new FormData();
            formData.append("id", vm.profil.id);
            if (vm.profil.password !== undefined) {
                formData.append("password", vm.profil.password);
            }
            formData.append("email", vm.profil.email);
            formData.append("photo", vm.newPhoto);
            $http({
                method: "POST",
                url: currentuser._links.self,
                data: formData,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(function () {
                currentuser.photo = vm.newPhoto;
            });
        }
    };
};
profilController.$inject = ["$scope", "$http", "currentuser"];

module.exports = profilController;

},{}],52:[function(require,module,exports){
var config = function ($stateProvider) {
    $stateProvider.state("app.project.consommation", {
        controller: "consommationController",
        controllerAs: "consommationCtrl",
        templateUrl: "templates/project/consommation/member.html",
        url: "consommation"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

},{}],53:[function(require,module,exports){
function getWeekDays(moment, start) {
    var days = [];
    var day = moment(start);
    //On n'affiche que les jours ouverts
    for (var i = 0; i < 7; i++) {
        days.push(day);
        day = moment(day).add(1, 'days');
    }
    return days;
}

function getMonthDays(moment, start, month) {
    var days = [];
    var day = moment(start);
    while (day.month() === month) {
        //On n'affiche que les jours ouverts
        days.push(day);
        day = moment(day).add(1, 'days');
    }
    return days;
}

var consomationController = function (moment, project, consomationService, allocationService, appParameters) {
    var vm = this;
    vm.precision = "week";
    vm.start = moment().startOf('isoWeek');
    vm.allocations = {};
    var end = moment(vm.start);
    vm.showDetail = function (entry) {
        entry.showDetails = true;
    };
    vm.hideDetail = function (entry) {
        entry.showDetails = false;
    };
    vm.precisionChange = function () {
        vm.days = [];
        if (vm.precision === "week") {
            vm.start = vm.start.startOf('isoWeek');
            vm.days = getWeekDays(moment, vm.start);
            end = moment(vm.start).add(8, 'days');
            vm.entries = consomationService.loadConsommations(project, vm.start, end);
            vm.entries.$promise.then(function () {
                consomationService.checkMissingByDay(vm.entries, appParameters);
            });
        } else {
            vm.start = vm.start.startOf('month');
            vm.days = getMonthDays(moment, vm.start, vm.start.month());
            end = moment(vm.start).add(1, 'months');
            vm.entries = consomationService.loadConsommations(project, vm.start, end);
            //TODO Regroupe par semaine vm.days et vm.entries
            vm.entries.$promise.then(function () {
                var grouped = consomationService.groupByWeek(vm.entries, vm.days);
                vm.entries = grouped.entries;
                vm.days = grouped.weeks;
            });
        }
    };
    vm.previous = function () {
        if (vm.precision === "week") {
            vm.start = vm.start.subtract(7, "days");
        } else {
            vm.start = vm.start.subtract(1, "months");
        }
        vm.precisionChange();
    };
    vm.next = function () {
        if (vm.precision === "week") {
            vm.start = vm.start.add(7, "days");
        } else {
            vm.start = vm.start.add(1, "months");
        }
        vm.precisionChange();
    };
    vm.checkAllocation = function (allocation) {
        return allocation === vm.max.value;
    };
    vm.precisionChange();
};
consomationController.$inject = ["moment", "project", "consomationService", "allocationService", "appParameters"];
module.exports = consomationController;

},{}],54:[function(require,module,exports){
var config = require("./consommation.config");
var consommationController = require("./consommation.controller");
var consoService = require("./consommation.service");
module.exports = angular.module('kanban.project.consommation', []).config(config).controller("consommationController", consommationController).service("consomationService", consoService);

},{"./consommation.config":52,"./consommation.controller":53,"./consommation.service":55}],55:[function(require,module,exports){
function groupWeeks(days) {
    var result = [];
    var weeks = [];
    var i = 0;
    var currentWeek;
    angular.forEach(days, function (day) {
        if (!currentWeek || day.week() !== currentWeek) {
            currentWeek = day.week();
            i++;
        }
        if (!weeks[i]) {
            weeks[i] = [];
        }
        weeks[i].push(day);
    });
    angular.forEach(weeks, function (week) {
        var weekObj = {
            id: week[0].week(),
            label: week[0].format("DD/MM") + " au " + week[week.length - 1].format("DD/MM"),
            days: week
        };
        result.push(weekObj);
    });
    return result;
}

function convertStringToDate(strDate) {
    var tabDate = strDate.split("/");
    try {
        return new Date(tabDate[1] + "/" + tabDate[0] + "/" + tabDate[2]);
    } catch (err) {}
}

var consommationService = function (allocationService) {
    return {
        loadConsommations: function (project, start, end) {
            return project.resource("member").query(function (data) {
                angular.forEach(data, function (member) {
                    // need to multipy by 1000 for get UNIX Timestamp
                    member.imputations = member.resource("imputation").get({ start: start.format("X") * 1000,
                        end: end.format("X") * 1000 });
                });
            });
        },
        groupByWeek: function (entries, days) {
            var grouped = {
                weeks: groupWeeks(days),
                entries: entries
            };
            angular.forEach(entries, function (entry) {
                entry.imputations.$promise.then(function () {
                    var groupedImputations = [];
                    angular.forEach(grouped.weeks, function (week) {
                        var timeSpent = 0;
                        angular.forEach(week.days, function (day) {
                            timeSpent += entry.imputations.imputations[day.format("DD/MM/YYYY")];
                        });
                        groupedImputations[week.id] = timeSpent;
                    });
                    entry.imputations.imputations = groupedImputations;
                    angular.forEach(entry.imputations.details, function (detail) {
                        var groupedDetailsImputation = [];
                        angular.forEach(grouped.weeks, function (week) {
                            var timeSpent = 0;
                            angular.forEach(week.days, function (day) {
                                timeSpent += detail.imputations[day.format("DD/MM/YYYY")];
                            });
                            groupedDetailsImputation[week.id] = timeSpent;
                        });
                        detail.imputations = groupedDetailsImputation;
                    });
                });
            });
            return grouped;
        },
        checkMissingByDay: function (entries, appParameters) {
            var allocations = allocationService.loadAllocation(appParameters);
            angular.forEach(entries, function (entry) {
                entry.imputations.$promise.then(function () {
                    for (var i = 0; i < entry.imputations.imputations.length; i++) {
                        if (entry.imputations.imputations[i].valImputation !== parseInt(allocations.max) && convertStringToDate(entry.imputations.imputations[i].imputationDate) < new Date()) {
                            entry.imputations.imputations[i].areMissing = true;
                        }
                    }
                });
            });
        }

    };
};
consommationService.$inject = ["allocationService"];
module.exports = consommationService;

},{}],56:[function(require,module,exports){
var ganttController = function ($uibModal, project, ganttService) {
    var vm = this;
    vm.addTask = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/add.html",
            controller: "addTaskController",
            controllerAs: "addTaskCtrl",
            resolve: {
                project: function () {
                    return project;
                }
            },
            size: "md"
        });
        modalInstance.result.then(function () {});
    };
    vm.data = ganttService.loadRows(project);
};
ganttController.$inject = ["$uibModal", "project", "ganttService"];
module.exports = ganttController;

},{}],57:[function(require,module,exports){
var ganttController = require("./gantt.controller");
var ganttService = require("./gantt.service");
module.exports = angular.module("kanban.project.gantt", ["gantt", 'gantt.sortable', 'gantt.movable', 'gantt.overlap', 'gantt.dependencies', 'gantt.tooltips', 'gantt.bounds', 'gantt.table', 'gantt.tree', 'gantt.groups', 'gantt.resizeSensor']).controller("ganttController", ganttController).service("ganttService", ganttService);

},{"./gantt.controller":56,"./gantt.service":58}],58:[function(require,module,exports){
var ganttService = function ($q) {

    var retrieveTaskBySwimlane = function (project, swimlane) {
        swimlane.tasks = [];
        var ganttTasks = project.resource("task").query({ swimlane: swimlane.id });
        ganttTasks.$promise.then(function (tasks) {
            angular.forEach(tasks, function (task) {
                swimlane.tasks.push(fetchToGanttTask(task));
            });
        });
    };
    var retrieveTaskNoSwimlane = function (project) {
        var backlog = { name: "backlog", tasks: [] };
        var ganttTasks = project.resource("task").query({ noswimlane: true });
        ganttTasks.$promise.then(function (tasks) {
            angular.forEach(tasks, function (task) {
                backlog.tasks.push(fetchToGanttTask(task));
            });
        });
        return backlog;
    };

    var fetchToGanttTask = function (task) {
        var startDate = moment();
        var endDate = moment();
        if (task.plannedStart) {
            startDate = task.plannedStart;
        }
        if (task.plannedEnding) {
            endDate = task.plannedEnding;
        }
        return {
            id: task.id,
            name: task.name,
            from: startDate,
            to: endDate,
            color: "#0288d1"
        };
    };

    return {
        loadRows: function (project) {
            var data = [];
            data.push(retrieveTaskNoSwimlane(project));
            var swimlanesResource = project.resource("swimlane").query();
            swimlanesResource.$promise.then(function (swimlanes) {
                angular.forEach(swimlanes, function (swimlane) {
                    data.push(swimlane);
                    retrieveTaskBySwimlane(project, swimlane);
                });
            });
            return data;
        }
    };
};
ganttService.$inject = ["$q"];

module.exports = ganttService;

},{}],59:[function(require,module,exports){
var kanbanController = function ($uibModal, project, kanbanService) {
    var vm = this;

    var loadKanban = function () {
        vm.states = project.resource("state").query({ "kanban": true });
        vm.swimlanes = kanbanService.load(project);
        vm.swimlanesToFiltre = vm.swimlanes;
    };
    project.$promise.then(loadKanban);
    vm.addTask = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/add.html",
            controller: "addTaskController",
            controllerAs: "addTaskCtrl",
            resolve: {
                project: function () {
                    return project;
                }
            },
            size: "md"
        });
        modalInstance.result.then(loadKanban);
    };
    vm.kanbanSortOptions = {
        itemMoved: function (event) {
            var task = event.source.itemScope.modelValue;
            task.state.id = event.dest.sortableScope.element.attr("data-columnindex");
            var swimlaneId = event.dest.sortableScope.element.attr("data-rowindex");
            if (swimlaneId) {
                if (!task.swimlane) {
                    task.swimlane = {};
                }
                task.swimlane.id = event.dest.sortableScope.element.attr("data-rowindex");
            } else {
                task.swimlane = null;
            }
            task.resource("self").save(null, task, function () {
                vm.states = project.resource("state").query({ "order": "position" });
            });
        }
    };

    vm.resetFilter = function () {
        vm.filter.currentuser = false;
        vm.filter.urgent = false;
    };
};
kanbanController.$inject = ["$uibModal", "project", "kanbanService"];
module.exports = kanbanController;

},{}],60:[function(require,module,exports){
var kanbanController = require("./kanban.controller");
var kanbanService = require("./kanban.service");
var currentuserKanbanFilter = require("./user.filter");
var urgentKanbanFilter = require("./urgent.filter");
module.exports = angular.module('kanban.project.kanban', []).controller("kanbanController", kanbanController).service("kanbanService", kanbanService).filter("currentuserKanbanFilter", currentuserKanbanFilter).filter("urgentKanbanFilter", urgentKanbanFilter);

},{"./kanban.controller":59,"./kanban.service":61,"./urgent.filter":62,"./user.filter":63}],61:[function(require,module,exports){
var kanbanService = function ($q, taskAssemblerService) {

    var fetchKanbanTask = function (tasks) {
        angular.forEach(tasks, function (task) {
            task = taskAssemblerService(task);
        });
        return tasks;
    };

    var retrieveTaskBySwimlane = function (project, states, swimlaneId) {
        var result = [];
        var i = 0;
        angular.forEach(states, function (state) {
            result[i] = { id: state.id };
            result[i].tasks = project.resource("task").query({ "swimlane": swimlaneId, "state": state.id }, fetchKanbanTask);
            i++;
        });
        return result;
    };

    var retrieveTaskNoSwimlane = function (project, states) {
        var result = [];
        var i = 0;
        angular.forEach(states, function (state) {
            result[i] = { id: state.id };
            result[i].tasks = project.resource("task").query({ "noswimlane": true, "state": state.id }, fetchKanbanTask);
            i++;
        });
        return result;
    };

    return {
        load: function (project) {
            var tasks = [];
            project.$promise.then(function () {
                var statesResource = project.resource("state").query({ "kanban": true });
                var swimlanesResource = project.resource("swimlane").query();
                $q.all([statesResource.$promise, swimlanesResource.$promise]).then(function (data) {
                    var states = data[0];
                    var swimlanes = data[1];
                    angular.forEach(swimlanes, function (swimlane) {
                        tasks.push(swimlane);
                        swimlane.states = retrieveTaskBySwimlane(project, states, swimlane.id);
                    });
                    var noswimlane = { states: states = retrieveTaskNoSwimlane(project, states) };
                    tasks.push(noswimlane);
                });
            });
            return tasks;
        }
    };
};
kanbanService.$inject = ["$q", "taskAssemblerService"];
module.exports = kanbanService;

},{}],62:[function(require,module,exports){
function urgentKanbanFilter() {
    return function (input, activate) {
        if (activate) {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i].urgent) {
                    out.push(input[i]);
                }
            }
            return out;
        }
        return input;
    };
}
module.exports = urgentKanbanFilter;

},{}],63:[function(require,module,exports){
function currentuserKanbanFilter(currentUserService) {
    var currentuser = currentUserService.get();
    return function (input, activate) {
        if (activate) {
            var out = [];
            for (var i = 0; i < input.length; i++) {
                for (var j = 0; j < input[i].assignees.length; j++) {
                    if (input[i].assignees[j].userId === currentuser.id) {
                        out.push(input[i]);
                    }
                }
            }
            return out;
        }
        return input;
    };
}

currentuserKanbanFilter.$inject = ["currentUserService"];

module.exports = currentuserKanbanFilter;

},{}],64:[function(require,module,exports){
var resolveProject = function ($stateParams, projectService) {
    return projectService.get({ "projectId": $stateParams.projectId });
};
resolveProject.$inject = ["$stateParams", "projectService"];

var resolveUserRights = function ($q, $stateParams, currentuser) {
    var defer = $q.defer();
    currentuser.$promise.then(function () {
        var isAdmin = currentuser.applicationRole === "ADMIN";
        currentuser.resource("member").get({ "projectId": $stateParams.projectId }, function (data) {
            var projectRole = data.projectRole;
            var rights = {
                hasAdminRights: isAdmin || projectRole === "MANAGER",
                hasEditRights: isAdmin || projectRole === "MANAGER" || projectRole === "CONTRIBUTOR",
                hasReadRights: isAdmin || projectRole
            };
            defer.resolve(rights);
        });
    });
    return defer.promise;
};
resolveUserRights.$inject = ["$q", "$stateParams", "currentuser"];

var config = function ($stateProvider) {
    $stateProvider.state("app.project", {
        abstract: true,
        controller: "projectController",
        controllerAs: "projectCtrl",
        templateUrl: "templates/project/layout-single.html",
        url: "project/:projectId/",
        resolve: {
            project: resolveProject,
            userRights: resolveUserRights
        }
    });
    $stateProvider.state("app.project.kanban", {
        templateUrl: "templates/project/kanban/kanban.html",
        controller: "kanbanController",
        controllerAs: "kanbanCtrl",
        url: "kanban"
    });
    $stateProvider.state("app.project.gantt", {
        templateUrl: "templates/project/gantt/gantt.html",
        controller: "ganttController",
        controllerAs: "ganttCtrl",
        url: "gantt"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

},{}],65:[function(require,module,exports){
var projectController = function ($state, project, userRights) {
    var vm = this;
    vm.project = project;
    if (!userRights.hasReadRights) {
        $state.transitionTo("app.dashboard");
    }
    vm.rights = userRights;
};
projectController.$inject = ["$state", "project", "userRights"];
module.exports = projectController;

},{}],66:[function(require,module,exports){
var kanbanModule = require("./kanban/kanban.module");
var taskModule = require("./task/task.module");
var consommationModule = require("./consommation/consommation.module");
var ganttModule = require("./gantt/gantt.module");
var config = require("./project.config");
var projectController = require("./project.controller");
var projectService = require("./project.service");
module.exports = angular.module('kanban.project', [kanbanModule.name, taskModule.name, consommationModule.name, ganttModule.name]).config(config).controller("projectController", projectController).service("projectService", projectService);

},{"./consommation/consommation.module":54,"./gantt/gantt.module":57,"./kanban/kanban.module":60,"./project.config":64,"./project.controller":65,"./project.service":67,"./task/task.module":82}],67:[function(require,module,exports){
var projectService = function ($resource) {
    return $resource("/api/project/:projectId");
};
projectService.$inject = ["$resource"];
module.exports = projectService;

},{}],68:[function(require,module,exports){
var addController = function ($uibModalInstance, project) {
    var vm = this;
    vm.categories = project.resource("category").query();
    vm.swimlanes = project.resource("swimlane").query();
    vm.submit = function () {
        project.resource("task").save(vm.task, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "project"];
module.exports = addController;

},{}],69:[function(require,module,exports){
var addController = function ($uibModalInstance, task, project) {
    var vm = this;
    vm.getMembers = function (term) {
        return project.resource("member").query({ search: term }).$promise;
    };
    vm.selectMember = function ($item, $model, $label) {
        vm.allocation.member = $model;
    };
    vm.submit = function () {
        task.resource("allocation").save(vm.allocation, function () {
            $uibModalInstance.close();
        }, function (error) {
            vm.error = error.data;
        });
    };
};
addController.$inject = ["$uibModalInstance", "task", "project"];
module.exports = addController;

},{}],70:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
module.exports = angular.module('kanban.project.task.allocation', []).controller("allocationListController", listController).controller("allocationAddController", addController);

},{"./add.controller":69,"./list.controller":71}],71:[function(require,module,exports){
var listController = function ($uibModal, currenttask, currentproject) {
    var vm = this;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/allocation/add.html",
            controller: "allocationAddController",
            controllerAs: "addAllocationCtrl",
            resolve: {
                task: function () {
                    return currenttask;
                },
                project: function () {
                    return currentproject;
                }
            },
            size: "xd"
        });
        modalInstance.result.then(function () {
            vm.allocations = currenttask.resource("allocation").query();
        });
    };
    vm.delete = function (allocation) {
        allocation.resource("self").delete(null, function () {
            vm.allocations = currenttask.resource("allocation").query();
        });
    };
    vm.allocations = currenttask.allocations = currenttask.resource("allocation").query();
};
listController.$inject = ["$uibModal", "task", "project"];
module.exports = listController;

},{}],72:[function(require,module,exports){
var addController = function ($uibModalInstance, task, comment) {
    var vm = this;
    if (comment.id) {
        vm.parentComment = comment;
    }
    vm.submit = function () {
        if (vm.parentComment) {
            vm.parentComment.resource("reply").save(vm.comment, function () {
                $uibModalInstance.close();
            }, function (error) {
                vm.error = error.data;
            });
        } else {
            task.resource("comment").save(vm.comment, function () {
                $uibModalInstance.close();
            }, function (error) {
                vm.error = error.data;
            });
        }
    };
};
addController.$inject = ["$uibModalInstance", "task", "comment"];
module.exports = addController;

},{}],73:[function(require,module,exports){
var listController = require("./list.controller");
var addController = require("./add.controller");
var replyController = require("./reply.controller");
module.exports = angular.module('kanban.project.task.comment', []).controller("commentListController", listController).controller("commentAddController", addController).controller("commentReplyController", replyController);

},{"./add.controller":72,"./list.controller":74,"./reply.controller":75}],74:[function(require,module,exports){
var listController = function ($uibModal, scope) {
    var vm = this;
    var currenttask = scope.taskCtrl.task;
    vm.add = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/comment/add.html",
            controller: "commentAddController",
            controllerAs: "addCommentCtrl",
            resolve: {
                task: function () {
                    return currenttask;
                },
                comment: {}
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            vm.comments = currenttask.resource("comment").query();
        });
    };
    vm.reply = function (comment) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/comment/add.html",
            controller: "commentAddController",
            controllerAs: "addCommentCtrl",
            resolve: {
                comment: function () {
                    return comment;
                },
                task: function () {
                    return currenttask;
                }
            },
            size: "md"
        });
        modalInstance.result.then(function () {
            comment.showComment = true;
            vm.selectedComment = comment.resource("reply").query();
        });
    };
    vm.showHideReply = function (comment) {
        if (comment.showComment) {
            comment.showComment = false;
        } else {
            vm.selectedComment = comment.resource("reply").query();
            comment.showComment = true;
        }
    };
    vm.delete = function (parentComment, comment) {
        comment.resource("self").delete(null, function () {
            if (parentComment !== null) {
                vm.selectedComment = parentComment.resource("reply").query();
            } else {
                vm.comments = currenttask.resource("comment").query();
                if (vm.selectedComment === comment) {
                    vm.selectedComment = null;
                }
            }
        });
    };
    currenttask.$promise.then(function () {
        vm.comments = currenttask.resource("comment").query();
    });
};
listController.$inject = ["$uibModal", "$scope"];
module.exports = listController;

},{}],75:[function(require,module,exports){
var listController = function (scope) {
    var vm = this;
    scope.$watch("commentListCtrl.selectedComment", function (newVal, oldVal) {
        var currentcomment = newVal;
        currentcomment.$promise.then(function (data) {
            vm.replies = data;
        });
    });
};
listController.$inject = ["$scope"];
module.exports = listController;

},{}],76:[function(require,module,exports){
var histoController = function (scope, histoService) {
    var vm = this;
    vm.page = 1;
    vm.size = 10;
    vm.cpt = 0;
    vm.busy = false;
    vm.histosTask = [];
    vm.noMoreHisto = false;

    vm.loadHisto = function () {
        if (!vm.noMoreHisto) {
            // We check that the last call did not return no result
            if (!vm.busy) {
                // We check that it does not another calling to server
                vm.busy = true;
                var currenttask = scope.taskCtrl.task;
                currenttask.$promise.then(function () {
                    currenttask.resource("histo").query({ page: vm.page, size: vm.size }).$promise.then(function (data) {
                        if (data.length > 0) {
                            vm.histosTask.push(data);
                            angular.forEach(data, function (histoTask) {
                                vm.histosTask[vm.cpt] = histoService(histoTask);
                                vm.cpt++;
                            });
                            vm.busy = false;
                        } else {
                            // if the last return has no result, noMoreHisto becomes true
                            vm.noMoreHisto = true;
                        }
                    });
                    vm.page = vm.page + 10;
                    vm.size = vm.size + 10;
                });
            }
        }
    };

    vm.loadHisto();
};
histoController.$inject = ["$scope", "histoService"];
module.exports = histoController;

},{}],77:[function(require,module,exports){
var histoController = require("./history.controller");
var histoService = require("./history.service");
module.exports = angular.module('kanban.project.task.history', []).controller("histoController", histoController).service("histoService", histoService);

},{"./history.controller":76,"./history.service":78}],78:[function(require,module,exports){
var histoService = function ($http, HateoasInterface, moment) {
    return function (histoTask) {
        if (histoTask._links.project) {
            histoTask.projectNameChecked = false;
            $http.get(histoTask._links.project).then(function (data) {
                if (histoTask.projectName === data.name) {
                    histoTask.projectNameChecked = true;
                }
            });
        }
        if (histoTask._links.state) {
            histoTask.stateNameChecked = false;
            $http.get(histoTask._links.state).then(function (state) {
                if (histoTask.stateName === state.data.name) {
                    histoTask.stateNameChecked = true;
                }
            });
        }
        if (histoTask._links.assignee) {
            histoTask.assigneeNameChecked = false;
            $http.get(histoTask._links.assignee).then(function (assignee) {
                if (histoTask.assigneeName === assignee.data.name) {
                    histoTask.assigneeNameChecked = true;
                }
            });
        }
        if (histoTask._links.category) {
            histoTask.categoryNameChecked = false;
            $http.get(histoTask._links.category).then(function (category) {
                if (histoTask.categoryName === category.data.name) {
                    histoTask.categoryNameChecked = true;
                }
            });
        }
        if (histoTask._links.swimlane) {
            histoTask.swimlaneNameChecked = false;
            $http.get(histoTask._links.swimlane).then(function (swimlane) {
                if (histoTask.swimlaneName === swimlane.data.name) {
                    histoTask.swimlaneNameChecked = true;
                }
            });
        }
        return histoTask;
    };
};

histoService.$inject = ["$http", "HateoasInterface", "moment"];
module.exports = histoService;

},{}],79:[function(require,module,exports){
var taskController = function ($uibModal, project, taskAssemblerService, HateoasInterface) {
    var vm = this;
    vm.filter = { state: "all", swimlane: "all", category: "all", member: "all" };
    vm.loadPage = function () {
        project.resource("task").get({
            page: vm.tasks.page.number - 1,
            size: vm.tasks.page.size,
            sort: vm.sort.field,
            sortDirection: vm.sort.sortDirection
        }, function (data) {
            if (data._embedded) {
                angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
            }
            data.page.number++;
            vm.tasks = data;
        });
        vm.states = project.resource("state").query();
        vm.swimlanes = project.resource("swimlane").query();
        vm.members = project.resource("member").query();
        vm.categories = project.resource("category").query();
    };
    vm.tasks = {
        page: {
            size: 10,
            number: 1
        }
    };
    vm.sort = {
        field: "name",
        sortDirection: "desc"
    };
    vm.loadPage();
    vm.delete = function (task) {
        new HateoasInterface(task).resource("self").delete(vm.loadPage);
    };
    vm.addTask = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "templates/project/task/add.html",
            controller: "addTaskController",
            controllerAs: "addTaskCtrl",
            resolve: {
                project: function () {
                    return project;
                }
            },
            size: "md"
        });
        modalInstance.result.then(vm.loadPage);
    };
    vm.tableFilter = function (predicate) {
        if (vm.sort.field !== predicate) {
            vm.sort.sortDirection = "";
        }
        vm.sort.sortDirection = vm.sort.sortDirection === "desc" ? "asc" : "desc";
        vm.sort.field = predicate;
        vm.loadPage();
    };
    vm.changedFilter = function () {

        var filter = {};
        if (vm.filter.state !== "all") {
            filter.idState = vm.filter.state;
        }

        if (vm.filter.swimlane !== "all") {
            filter.idSwimlane = vm.filter.swimlane;
        }

        if (vm.filter.member !== "all") {
            filter.idAssignee = vm.filter.member;
        }

        if (vm.filter.category !== 'all') {
            filter.idCategory = vm.filter.category;
        }

        if (vm.filter.deleted) {
            filter.deleted = true;
        }
        project.resource("task").get({ idState: filter.idState, idSwimlane: filter.idSwimlane, idAssignee: filter.idAssignee,
            idCategory: filter.idCategory, deleted: filter.deleted, page: vm.tasks.page.number - 1,
            size: vm.tasks.page.size, sort: vm.sort.field, sortDirection: vm.sort.sortDirection }, function (data) {
            if (data._embedded) {
                angular.forEach(data._embedded.taskResourceList, taskAssemblerService);
            }
            data.page.number++;
            vm.tasks = data;
        });
    };
    vm.resetFilter = function () {
        vm.filter.state = "all";
        vm.filter.swimlane = "all";
        vm.filter.category = "all";
        vm.filter.member = "all";
        vm.changedFilter();
    };
};
taskController.$inject = ["$uibModal", "project", "taskAssemblerService", "HateoasInterface"];
module.exports = taskController;

},{}],80:[function(require,module,exports){
var resolveTask = function ($stateParams, taskService) {
    return taskService.get({ "projectId": $stateParams.projectId, "taskId": $stateParams.taskId });
};
resolveTask.$inject = ["$stateParams", "taskService"];

var config = function ($stateProvider) {
    $stateProvider.state("app.project.tasks", {
        templateUrl: "templates/project/task/list.html",
        controller: "tasklistController",
        controllerAs: "tasksCtrl",
        url: "tasks"
    });
    $stateProvider.state("app.project.task", {
        templateUrl: "templates/project/task/task.html",
        controller: "taskController",
        controllerAs: "taskCtrl",
        resolve: {
            task: resolveTask
        },
        url: "task/:taskId"
    });
    $stateProvider.state("app.project.task.allocation", {
        templateUrl: "templates/project/task/allocation/list.html",
        controller: "allocationListController",
        controllerAs: "allocationListCtrl",
        url: "/allocation"
    });
};
config.$inject = ["$stateProvider"];
module.exports = config;

},{}],81:[function(require,module,exports){

var taskController = function ($q, $state, project, currenttask, taskAssemblerService, allocationService, growl, appParameters) {
    var vm = this;
    vm.customFieldMap = {};
    vm.task = currenttask;

    vm.allocation = allocationService.loadAllocation(appParameters);
    //vm.task.description;
    project.$promise.then(function () {
        currenttask.$promise.then(function () {
            vm.task = taskAssemblerService(currenttask);
            vm.children = vm.task.resource("children").query();
            vm.parents = vm.task.resource("parents").query();
        });
        vm.categories = project.resource("category").query();
        vm.states = project.resource("state").query();
        vm.swimlanes = project.resource("swimlane").query();
        var customfields = project.resource("taskfield").query();
        $q.all([customfields.$promise, currenttask.$promise]).then(function (data) {
            vm.task.customField = [];
            angular.forEach(data[0], function (customField) {
                vm.customFieldMap[customField.fieldName] = {
                    definition: customField
                };
                vm.task.customField.push(vm.customFieldMap[customField.fieldName]);
            });
            vm.task.resource("customfield").query(function (data) {
                angular.forEach(data, function (customField) {
                    if (vm.customFieldMap[customField.fieldName].definition.type === "NUMBER") {
                        vm.customFieldMap[customField.fieldName].fieldValue = parseFloat(customField.fieldValue);
                    } else if (vm.customFieldMap[customField.fieldName].definition.type === "DATE") {
                        vm.customFieldMap[customField.fieldName].fieldValue = null;
                        if (customField.fieldValue !== null) {
                            vm.customFieldMap[customField.fieldName].fieldValue = new Date(customField.fieldValue);
                        } else if (vm.customFieldMap[customField.fieldName].definition.required === true) {
                            vm.customFieldMap[customField.fieldName].fieldValue = new Date();
                        }
                    } else {
                        vm.customFieldMap[customField.fieldName].fieldValue = customField.fieldValue;
                    }
                });
            });
        });
    });
    vm.selectAssignee = function ($item, $model, $label) {
        var userAlreadyAssigned = false;
        angular.forEach(vm.task.assignees, function (user) {
            if (user.id === $model.id) {
                userAlreadyAssigned = true;
                growl.error("Utilisateur déjà assigné");
            }
        });
        if (!userAlreadyAssigned) {
            vm.task.assignees.push($model);
        }
    };
    vm.removeuser = function (index) {
        vm.task.assignees.splice(index, 1);
    };
    vm.getMembers = function (term) {
        return project.resource("member").query({ search: term }).$promise;
    };
    vm.addChild = function ($item, $model, $label) {
        vm.task.resource("children").save($item, function () {
            vm.children.push($item);
        });
    };
    vm.addParent = function ($item, $model, $label) {
        vm.task.resource("parents").save($item, function () {
            vm.parents.push($item);
        });
    };
    vm.removeChild = function (index) {
        vm.children.splice(index, 1);
    };
    vm.removeParent = function (index) {
        vm.parents.splice(index, 1);
    };
    vm.getTasks = function (term) {
        return project.resource("task").query({ idTask: vm.task.id, search: term }).$promise;
    };
    vm.submit = function () {
        angular.forEach(vm.task.customField, function (customField) {
            if (vm.customFieldMap[customField.definition.fieldName].value) {
                customField.value = vm.customFieldMap[customField.definition.fieldName].value;
            }
        });
        vm.task.resource("self").save(vm.task, function () {
            $state.transitionTo("app.project.kanban", { projectId: project.id });
        }, function (error) {
            vm.error = error.data;
        });
    };
};
taskController.$inject = ["$q", "$state", "project", "task", "taskAssemblerService", "allocationService", "growl", "appParameters"];
module.exports = taskController;

},{}],82:[function(require,module,exports){
var commentModule = require("./comment/comment.module");
var allocationModule = require("./allocation/allocation.module");
var config = require("./task.config");
var addTaskController = require("./add.controller");
var tasklistController = require("./list.controller");
var taskController = require("./task.controller");
var histoModule = require("./history/history.module");
var taskService = require("./task.service");
var taskAssemblerService = require("./taskAssembler.service");
module.exports = angular.module('kanban.project.task', [commentModule.name, allocationModule.name, histoModule.name]).config(config).controller("addTaskController", addTaskController).controller("tasklistController", tasklistController).controller("taskController", taskController).service("taskService", taskService).service("taskAssemblerService", taskAssemblerService);

},{"./add.controller":68,"./allocation/allocation.module":70,"./comment/comment.module":73,"./history/history.module":77,"./list.controller":79,"./task.config":80,"./task.controller":81,"./task.service":83,"./taskAssembler.service":84}],83:[function(require,module,exports){
var taskService = function ($resource) {
    return $resource("/api/project/:projectId/task/:taskId", { projectId: "@projectId", id: "@taskId" });
};
taskService.$inject = ["$resource"];
module.exports = taskService;

},{}],84:[function(require,module,exports){
var taskAssemblerService = function ($http, HateoasInterface, moment) {
    return function (task) {
        var taskresource = task;
        if (!task.resource) {
            taskresource = new HateoasInterface(task);
        }
        task.state = taskresource.resource("state").get();
        if (task._links.category) {
            task.category = taskresource.resource("category").get();
        }
        if (task._links.swimlane) {
            task.swimlane = taskresource.resource("swimlane").get();
        }
        task.assignees = taskresource.resource("assignee").query(function (assignees) {
            angular.forEach(assignees, function (assignee) {
                if (assignee._links.photo) {
                    $http.get(assignee._links.photo).then(function (result) {
                        assignee.photo = result.data;
                    });
                }
                $http.get(assignee._links.user).then(function (result) {
                    assignee.userId = result.data.id;
                });
            });
            return assignees;
        });
        task.exceededLoad = task.timeRemains + task.timeSpent > task.estimatedLoad;
        if (taskresource.plannedEnding !== null) {
            var today = moment();
            task.plannedEnding = moment(taskresource.plannedEnding).toDate();
            task.state.$promise.then(function () {
                task.exceededDate = today.isAfter(task.plannedEnding, 'day') && !task.state.closeState;
            });
        }
        if (taskresource.plannedStart !== null) {
            task.plannedStart = moment(taskresource.plannedStart).toDate();
        }
        return task;
    };
};
taskAssemblerService.$inject = ["$http", "HateoasInterface", "moment"];
module.exports = taskAssemblerService;

},{}]},{},[33])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxhZG1pbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXGNhdGVnb3J5XFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXGNhdGVnb3J5XFxjYXRlZ29yeS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxjYXRlZ29yeVxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcZWRpdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbWVtYmVyXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXG1lbWJlclxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbWVtYmVyXFxtZW1iZXIubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxccHJvamVjdC5jb25maWcuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxwcm9qZWN0Lm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN0YXRlXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN0YXRlXFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxzdGF0ZVxcc3RhdGUubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcc3dpbWxhbmVcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcc3dpbWxhbmVcXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN3aW1sYW5lXFxzd2ltbGFuZS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFx0YXNrZmllbGRcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2ZpZWxkXFxmaWVsZHR5cGUuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHRhc2tmaWVsZFxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2ZpZWxkXFx0YXNrZmllbGQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2hpc3RvXFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFx0YXNraGlzdG9cXHRhc2toaXN0by5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHVzZXJcXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHVzZXJcXHVzZXIuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxcdXNlclxcdXNlci5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFx1c2VyLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFx1c2Vycm9sZS5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYXBwLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAucnVuLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxkYXNoYm9hcmRcXGNhbGVuZGFyXFxhZGRpbXB1dGF0aW9uLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcZGlyZWN0aXZlXFxjaGVja2JveGZpbHRlci5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRpcmVjdGl2ZVxcZXJyb3IuZGlyZWN0aXZlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxkaXJlY3RpdmVcXHNhbWVQYXNzd29yZC5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRpcmVjdGl2ZVxcdG9nZ2xlci5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGxvZ2luXFxhdXRoLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGxvZ2luXFxjdXJyZW50dXNlci5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxsb2dpblxcbG9naW4uY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcbG9naW5cXGxvZ2luLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccGFyYW1ldGVyXFxhbGxvY2F0aW9uLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHBhcmFtZXRlclxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwYXJhbWV0ZXJcXHBhcmFtZXRlci5jb25maWcuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHBhcmFtZXRlclxccGFyYW1ldGVyLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccGFyYW1ldGVyXFxwYXJhbWV0ZXIuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvZmlsXFxwcm9maWwuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcY29uc29tbWF0aW9uXFxjb25zb21tYXRpb24uY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxjb25zb21tYXRpb25cXGNvbnNvbW1hdGlvbi5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxjb25zb21tYXRpb25cXGNvbnNvbW1hdGlvbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGNvbnNvbW1hdGlvblxcY29uc29tbWF0aW9uLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGdhbnR0XFxnYW50dC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxnYW50dFxcZ2FudHQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxnYW50dFxcZ2FudHQuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxca2FuYmFuXFxrYW5iYW4uY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxca2FuYmFuXFxrYW5iYW4ubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxrYW5iYW5cXGthbmJhbi5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxrYW5iYW5cXHVyZ2VudC5maWx0ZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGthbmJhblxcdXNlci5maWx0ZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHByb2plY3QuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHByb2plY3QubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxwcm9qZWN0LnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFxhbGxvY2F0aW9uXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcYWxsb2NhdGlvblxcYWxsb2NhdGlvbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGFsbG9jYXRpb25cXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcY29tbWVudFxcYWRkLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGNvbW1lbnRcXGNvbW1lbnQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFxjb21tZW50XFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGNvbW1lbnRcXHJlcGx5LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGhpc3RvcnlcXGhpc3RvcnkuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcaGlzdG9yeVxcaGlzdG9yeS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGhpc3RvcnlcXGhpc3Rvcnkuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrLmNvbmZpZy5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcdGFzay5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcdGFzay5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrQXNzZW1ibGVyLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFJLGdCQUFnQixRQUFRLDBCQUFSLENBQXBCO0FBQ0EsSUFBSSxhQUFhLFFBQVEsb0JBQVIsQ0FBakI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxNQUFSLENBQWUsY0FBZixFQUNULENBQUMsY0FBYyxJQUFmLEVBQXFCLFdBQVcsSUFBaEMsQ0FEUyxDQUFqQjs7O0FDRkEsSUFBSSxnQkFBZ0IsVUFBVSxpQkFBVixFQUE2QixRQUE3QixFQUF1QztBQUN2RCxRQUFJLEtBQUssSUFBVDtBQUNBLE9B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QWtCLE9BQU8sSUFBUCxDQUFZLEVBQTlCO0FBQ0gsaUJBRkQ7QUFHSCxhQVREO0FBVUEsbUJBQU8sU0FBUDtBQUNILFNBWmdCLENBQWpCO0FBYUEsYUFBSyxZQUFMLEdBQXFCLEtBQUssV0FBTCxHQUFtQixLQUFLLFNBQXhCLEdBQW9DLEtBQUssYUFBOUQ7QUFDQSxZQUFJLGFBQWEsYUFBYixLQUErQixJQUFuQyxFQUF5QztBQUNyQyxnQkFBSSxRQUFRLFFBQVo7QUFDQSxpQkFBSyxhQUFMLEdBQXFCLE9BQU8sYUFBYSxhQUFwQixFQUFtQyxNQUFuQyxFQUFyQjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLElBQXBCLENBQXlCLFlBQVk7QUFDakMscUJBQUssWUFBTCxHQUFxQixNQUFNLE9BQU4sQ0FBYyxLQUFLLGFBQW5CLEVBQWtDLEtBQWxDLEtBQTRDLENBQUMsS0FBSyxLQUFMLENBQVcsVUFBN0U7QUFDSCxhQUZEO0FBR0g7QUFDRCxZQUFJLGFBQWEsWUFBYixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyxpQkFBSyxZQUFMLEdBQW9CLE9BQU8sYUFBYSxZQUFwQixFQUFrQyxNQUFsQyxFQUFwQjtBQUNIO0FBQ0QsZUFBTyxJQUFQO0FBQ0gsS0FyQ0Q7QUFzQ0gsQ0F2Q0Q7QUF3Q0EscUJBQXFCLE9BQXJCLEdBQStCLENBQUMsT0FBRCxFQUFVLGtCQUFWLEVBQThCLFFBQTlCLENBQS9CO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLG9CQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvamVjdE1vZHVsZSA9IHJlcXVpcmUoXCIuL3Byb2plY3QvcHJvamVjdC5tb2R1bGVcIik7XHJcbnZhciB1c2VyTW9kdWxlID0gcmVxdWlyZShcIi4vdXNlci91c2VyLm1vZHVsZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluJyxcclxuICAgICAgICBbcHJvamVjdE1vZHVsZS5uYW1lLCB1c2VyTW9kdWxlLm5hbWVdKTtcclxuIiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHByb2plY3RzKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByb2plY3RzLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKHZtLnByb2plY3QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJwcm9qZWN0c1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyO1xyXG4iLCJ2YXIgYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwgcHJvamVjdCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwiY2F0ZWdvcnlcIikuc2F2ZSh2bS5jYXRlZ29yeSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5hZGRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiLCBcInByb2plY3RcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5hZG1pbi5wcm9qZWN0LmNhdGVnb3J5JywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJsaXN0Q2F0ZWdvcnlBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRDYXRlZ29yeUFkbWluQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKTsiLCIgICAgICAgIHZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdm0uYWRkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L2NhdGVnb3J5L2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRDYXRlZ29yeUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRDYXRlZ29yeUN0cmxcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5LnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZtLnNhdmVDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhdGVnb3J5LnJlc291cmNlKFwic2VsZlwiKS5zYXZlKGNhdGVnb3J5KS4kcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5yZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jYXRlZ29yaWVzID0gcHJvamVjdC5yZXNvdXJjZShcImNhdGVnb3J5XCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGlzdENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInByb2plY3RcIl07XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgZWRpdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHN0YXRlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0ucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwiYXBwLnByb2plY3QuZWRpdC50YXNrZmllbGRcIiwge3Byb2plY3RJZDogcHJvamVjdC5pZH0pO1xyXG59O1xyXG5lZGl0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHN0YXRlXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBlZGl0Q29udHJvbGxlcjtcclxuXHJcblxyXG4iLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBzY29wZSwgcHJvamVjdFNlcnZpY2UsIEhhdGVvYXNJbnRlcmZhY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICBmdW5jdGlvbiBsb2FkUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gcHJvamVjdFNlcnZpY2UuZ2V0KHtwYWdlOiB2bS5wcm9qZWN0cy5wYWdlLm51bWJlciwgc2l6ZTogdm0ucHJvamVjdHMucGFnZS5zaXplfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodm0ucHJvamVjdHMuX2VtYmVkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ucHJvamVjdHMuX2VtYmVkZGVkLnByb2plY3RSZXNvdXJjZUxpc3QsIGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdC5zdGF0ZXMgPSBuZXcgSGF0ZW9hc0ludGVyZmFjZShwcm9qZWN0KS5yZXNvdXJjZShcInN0YXRlXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Q7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdm0ucHJvamVjdHMgPSB7XHJcbiAgICAgICAgcGFnZToge1xyXG4gICAgICAgICAgICBudW1iZXI6IDAsXHJcbiAgICAgICAgICAgIHNpemU6IDE1XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnByb2plY3RzID0gbG9hZFBhZ2UoKTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFByb2plY3RDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3RzOiB2bS5wcm9qZWN0c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGVtaXQoXCJrYW5iYW46cHJvamVjdHMtdXBkYXRlc1wiKTtcclxuICAgICAgICAgICAgdm0ucHJvamVjdHMgPSBsb2FkUGFnZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UocHJvamVjdCkucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRlbWl0KFwia2FuYmFuOnByb2plY3RzLXVwZGF0ZXNcIik7XHJcbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gbG9hZFBhZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkc2NvcGVcIiwgXCJwcm9qZWN0U2VydmljZVwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gbGlzdENvbnRyb2xsZXI7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHVzZXJTZXJ2aWNlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc2VsZWN0VXNlciA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2bS5tZW1iZXIudXNlciA9ICRtb2RlbDtcclxuICAgIH07XHJcbiAgICB2bS5nZXRVc2VycyA9IGZ1bmN0aW9uICh0ZXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJTZXJ2aWNlLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5wcm9qZWN0Um9sZXMgPSBwcm9qZWN0LnJlc291cmNlKFwicm9sZXNcIikucXVlcnkoKTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLnNhdmUodm0ubWVtYmVyLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwidXNlclNlcnZpY2VcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgSGF0ZW9hc0ludGVyZmFjZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnByb2plY3RSb2xlcyA9IHByb2plY3QucmVzb3VyY2UoXCJyb2xlc1wiKS5xdWVyeSgpO1xyXG4gICAgdm0ubWVtYmVycyA9IHtcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIG51bWJlcjogMCxcclxuICAgICAgICAgICAgc2l6ZTogMTVcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdm0ubWVtYmVycyA9IHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikuZ2V0KFxyXG4gICAgICAgICAgICB7cGFnZTogdm0ubWVtYmVycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLm1lbWJlcnMucGFnZS5zaXplfSk7XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvbWVtYmVyL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkTWVtYmVyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRNZW1iZXJDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLm1lbWJlcnMgPSBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLmdldChcclxuICAgICAgICAgICAgICAgICAgICB7cGFnZTogdm0ubWVtYmVycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogdm0ubWVtYmVycy5wYWdlLnNpemV9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UobWVtYmVyKS5yZXNvdXJjZShcInNlbGZcIikuZGVsZXRlKG51bGwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0ubWVtYmVycyA9IHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikuZ2V0KFxyXG4gICAgICAgICAgICAgICAgICAgIHtwYWdlOiB2bS5tZW1iZXJzLnBhZ2UubnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiB2bS5tZW1iZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBIYXRlb2FzSW50ZXJmYWNlKG1lbWJlcikucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUobWVtYmVyKS4kcHJvbWlzZTtcclxuICAgICAgICByZXN1bHQuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmRhdGEgPSBlcnJvci5kYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCJwcm9qZWN0XCIsIFwiSGF0ZW9hc0ludGVyZmFjZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5hZG1pbi5wcm9qZWN0Lm1lbWJlcicsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdE1lbWJlckFkbWluQ29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcImFkZE1lbWJlckFkbWluQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKTtcclxuIiwiICAgICAgICB2YXIgY29uZmlnID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3RzXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJwcm9qZWN0TGlzdEFkbWluQ3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwicHJvamVjdFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXRcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJlZGl0UHJvamVjdEFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInByb2plY3RFZGl0Q3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvcHJvamVjdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiZWRpdFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXQuY2F0ZWdvcnlcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0Q2F0ZWdvcnlBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJjYXRlZ29yeUxpc3RDdHJsXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2F0ZWdvcnlcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC5lZGl0LnN3aW1sYW5lXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFN3aW1sYW5lQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwic3dpbWxhbmVMaXN0Q3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3Qvc3dpbWxhbmUvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N3aW1sYW5lXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC5tZW1iZXJcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0TWVtYmVyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwibWVtYmVyTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L21lbWJlci9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVtYmVyXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC5zdGF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImxpc3RTdGF0ZUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInN0YXRlTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L3N0YXRlL2xpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zdGF0ZVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXQudGFza2ZpZWxkXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFRhc2tmaWVsZEFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInRhc2tmaWVsZExpc3RDdHJsXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC90YXNrZmllbGQvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2N1c3RvbWZpZWxkXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC50YXNraGlzdG9cIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0VGFza0hpc3RvQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwidGFza0hpc3RvTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L3Rhc2toaXN0by9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvdGFza0hpc3RvXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG5cclxuIiwidmFyIHN0YXRlTW9kdWxlID0gcmVxdWlyZShcIi4vc3RhdGUvc3RhdGUubW9kdWxlXCIpO1xyXG52YXIgY2F0ZWdvcnlNb2R1bGUgPSByZXF1aXJlKFwiLi9jYXRlZ29yeS9jYXRlZ29yeS5tb2R1bGVcIik7XHJcbnZhciBzd2ltbGFuZU1vZHVsZSA9IHJlcXVpcmUoXCIuL3N3aW1sYW5lL3N3aW1sYW5lLm1vZHVsZVwiKTtcclxudmFyIG1lbWJlck1vZHVsZSA9IHJlcXVpcmUoXCIuL21lbWJlci9tZW1iZXIubW9kdWxlXCIpO1xyXG52YXIgdGFza2ZpZWxkTW9kdWxlID0gcmVxdWlyZShcIi4vdGFza2ZpZWxkL3Rhc2tmaWVsZC5tb2R1bGVcIik7XHJcbnZhciB0YXNrSGlzdG9Nb2R1bGUgPSByZXF1aXJlKFwiLi90YXNraGlzdG8vdGFza2hpc3RvLm1vZHVsZVwiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL3Byb2plY3QuY29uZmlnXCIpO1xyXG52YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbnZhciBlZGl0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2VkaXQuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QnLFxyXG4gICAgICAgIFtcImthbmJhbi5wcm9qZWN0XCIsIHN0YXRlTW9kdWxlLm5hbWUsIGNhdGVnb3J5TW9kdWxlLm5hbWUsXHJcbiAgICAgICAgICAgIHN3aW1sYW5lTW9kdWxlLm5hbWUsIG1lbWJlck1vZHVsZS5uYW1lLCB0YXNrZmllbGRNb2R1bGUubmFtZSwgdGFza0hpc3RvTW9kdWxlLm5hbWVdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRQcm9qZWN0QWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJlZGl0UHJvamVjdEFkbWluQ29udHJvbGxlclwiLCBlZGl0Q29udHJvbGxlcik7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJvamVjdC5yZXNvdXJjZShcInN0YXRlXCIpLnNhdmUodm0uc3RhdGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgZ3Jvd2wpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5zdGF0ZUxpc3RTb3J0T3B0aW9ucyA9IHtcclxuICAgICAgICBvcmRlckNoYW5nZWQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGVVcGRhdGVkID0gZXZlbnQuc291cmNlLml0ZW1TY29wZS5tb2RlbFZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBldmVudC5kZXN0LmluZGV4O1xyXG4gICAgICAgICAgICBzdGF0ZVVwZGF0ZWQucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuICAgICAgICAgICAgc3RhdGVVcGRhdGVkLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKG51bGwsIHN0YXRlVXBkYXRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9zdGF0ZS9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFN0YXRlQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRTdGF0ZUN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0ucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgc3RhdGUucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBncm93bC5lcnJvcihlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBzdGF0ZS5yZXNvdXJjZShcInNlbGZcIikuc2F2ZShzdGF0ZSkuJHByb21pc2U7XHJcbiAgICAgICAgcmVzdWx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZtLnN0YXRlcyA9IHByb2plY3QucmVzb3VyY2UoXCJzdGF0ZVwiKS5xdWVyeSgpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcImdyb3dsXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxudmFyIGFkZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hZGQuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3Quc3RhdGUnLCBbJ2FuZ3VsYXItZ3Jvd2wnXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImxpc3RTdGF0ZUFkbWluQ29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcImFkZFN0YXRlQWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpOyIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByb2plY3QucmVzb3VyY2UoXCJzd2ltbGFuZVwiKS5zYXZlKHZtLnN3aW1sYW5lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyO1xyXG4iLCJcclxudmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgbW9tZW50KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3dpbWxhbmVMaXN0U29ydE9wdGlvbnMgPSB7XHJcbiAgICAgICAgb3JkZXJDaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHN3aW1sYW5lVXBkYXRlZCA9IGV2ZW50LnNvdXJjZS5pdGVtU2NvcGUubW9kZWxWYWx1ZTtcclxuICAgICAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gZXZlbnQuZGVzdC5pbmRleDtcclxuICAgICAgICAgICAgc3dpbWxhbmVVcGRhdGVkLnBvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcbiAgICAgICAgICAgIHN3aW1sYW5lVXBkYXRlZC5yZXNvdXJjZShcInNlbGZcIikuc2F2ZShudWxsLCBzd2ltbGFuZVVwZGF0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3Qvc3dpbWxhbmUvYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRTd2ltbGFuZUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkU3dpbWxhbmVDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChzd2ltbGFuZSkge1xyXG4gICAgICAgIHN3aW1sYW5lLnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5zYXZlU3dpbWxhbmUgPSBmdW5jdGlvbiAoc3dpbWxhbmUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc3dpbWxhbmUucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUoc3dpbWxhbmUpLiRwcm9taXNlO1xyXG4gICAgICAgIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgZXJyb3IuZGF0YSA9IGVycm9yLmRhdGEubWVzc2FnZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKHN3aW1sYW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3dpbWxhbmUuZW5kUGxhbm5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aW1sYW5lLmVuZFBsYW5uZWQgPSBtb21lbnQoc3dpbWxhbmUuZW5kUGxhbm5lZCkudG9EYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcIm1vbWVudFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjtcclxuIiwidmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgYWRkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FkZC5jb250cm9sbGVyXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4uYWRtaW4ucHJvamVjdC5zd2ltbGFuZScsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFN3aW1sYW5lQWRtaW5Db250cm9sbGVyXCIsIGxpc3RDb250cm9sbGVyKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiYWRkU3dpbWxhbmVBZG1pbkNvbnRyb2xsZXJcIiwgYWRkQ29udHJvbGxlcik7XHJcbiIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwcm9qZWN0LCBmaWVsZHR5cGVTZXJ2aWNlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmllbGRUeXBlcyA9IGZpZWxkdHlwZVNlcnZpY2UucXVlcnkoKTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwidGFza2ZpZWxkXCIpLnNhdmUodm0udGFza2ZpZWxkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwicHJvamVjdFwiLCBcImZpZWxkdHlwZVNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ29udHJvbGxlcjsiLCJ2YXIgZmllbGRUeXBlU2VydmljZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3Rhc2tmaWVsZHR5cGVcIik7XHJcbn07XHJcbmZpZWxkVHlwZVNlcnZpY2UuJGluamVjdCA9IFtcIiRyZXNvdXJjZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmaWVsZFR5cGVTZXJ2aWNlOyIsInZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvdGFza2ZpZWxkL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVGFza2ZpZWxkQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRUYXNrZmllbGRDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uICh0YXNrZmllbGQpIHtcclxuICAgICAgICB0YXNrZmllbGQucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS50YXNrZmllbGRzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tmaWVsZFwiKS5xdWVyeSgpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbnZhciBmaWVsZHR5cGVTcnYgPSByZXF1aXJlKFwiLi9maWVsZHR5cGUuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QudGFza2ZpZWxkJywgW10pXHJcbiAgICAgICAgLnNlcnZpY2UoXCJmaWVsZHR5cGVTZXJ2aWNlXCIsIGZpZWxkdHlwZVNydilcclxuICAgICAgICAuY29udHJvbGxlcihcImxpc3RUYXNrZmllbGRBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRUYXNrZmllbGRBZG1pbkNvbnRyb2xsZXJcIiwgYWRkQ29udHJvbGxlcik7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5yZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0udGFza3NoaXN0byA9IHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KCk7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkKCk7XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QudGFza2hpc3RvJywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJsaXN0VGFza0hpc3RvQWRtaW5Db250cm9sbGVyXCIsIGxpc3RDb250cm9sbGVyKTsiLCJ2YXIgYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwgdXNlclJvbGVTZXJ2aWNlLCB1c2VyU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnJvbGVzID0gdXNlclJvbGVTZXJ2aWNlLnF1ZXJ5KCk7XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF2bS5lcnJvcikge1xyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5zYXZlKHZtLnVzZXIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5hZGRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiLCBcInVzZXJSb2xlU2VydmljZVwiLCBcInVzZXJTZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgSGF0ZW9hc0ludGVyZmFjZSwgdXNlclNlcnZpY2UsIHVzZXJSb2xlU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnVzZXJzID0ge1xyXG4gICAgICAgIHBhZ2U6IHtcclxuICAgICAgICAgICAgbnVtYmVyOiAwLFxyXG4gICAgICAgICAgICBzaXplOiAxNVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS51c2VyUm9sZXMgPSB1c2VyUm9sZVNlcnZpY2UucXVlcnkoKTtcclxuICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICBzaXplOiB2bS51c2Vycy5wYWdlLnNpemV9KTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vdXNlci9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFVzZXJBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFVzZXJBZG1pbkN0cmxcIixcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLnVzZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UodXNlcikucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLnVzZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEhhdGVvYXNJbnRlcmZhY2UodXNlcikucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUodXNlcikuJHByb21pc2U7XHJcbiAgICB9O1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwiSGF0ZW9hc0ludGVyZmFjZVwiLCBcInVzZXJTZXJ2aWNlXCIsIFwidXNlclJvbGVTZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnVzZXJzXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vdXNlci9saXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImxpc3RVc2VyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcInVzZXJzQ3RybFwiLFxyXG4gICAgICAgIHVybDogXCJ1c2Vyc1wiXHJcbiAgICB9KTtcclxufTtcclxuY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi91c2VyLmNvbmZpZ1wiKTtcclxudmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgYWRkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FkZC5jb250cm9sbGVyXCIpO1xyXG52YXIgdXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbnZhciB1c2VyUm9sZVNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2Vycm9sZS5zZXJ2aWNlXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4uYWRtaW4udXNlcicsIFtdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFVzZXJBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRVc2VyQWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJ1c2VyU2VydmljZVwiLCB1c2VyU2VydmljZSlcclxuICAgICAgICAuc2VydmljZShcInVzZXJSb2xlU2VydmljZVwiLCB1c2VyUm9sZVNlcnZpY2UpO1xyXG4iLCJ2YXIgdXNlclNlcnZpY2UgPSBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4gJHJlc291cmNlKFwiL2FwaS91c2VyXCIpO1xyXG59O1xyXG51c2VyU2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJTZXJ2aWNlO1xyXG4iLCJ2YXIgdXNlclJvbGVTZXJ2aWNlID0gZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZShcIi9hcGkvcm9sZVwiKTtcclxufTtcclxudXNlclJvbGVTZXJ2aWNlLiRpbmplY3QgPSBbXCIkcmVzb3VyY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclJvbGVTZXJ2aWNlO1xyXG4iLCJcclxuZnVuY3Rpb24gYXV0aFRva2VuSHR0cEludGVyY2VwdG9yKCRzZXNzaW9uU3RvcmFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBcInJlcXVlc3RcIjogZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgICAgICBpZiAoY29uZmlnLnVybCAmJiBjb25maWcudXJsLmluZGV4T2YoXCIuaHRtbFwiKSA9PT0gLTEgJiYgJHNlc3Npb25TdG9yYWdlLm9hdXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5hdXRob3JpemF0aW9uID0gJHNlc3Npb25TdG9yYWdlLm9hdXRoLnRva2VuX3R5cGUgKyBcIiBcIiArICRzZXNzaW9uU3RvcmFnZS5vYXV0aC5hY2Nlc3NfdG9rZW47XHJcbiAgICAgICAgICAgICAgICBjb25maWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuO1xyXG5hdXRoVG9rZW5IdHRwSW50ZXJjZXB0b3IuJGluamVjdCA9IFtcIiRzZXNzaW9uU3RvcmFnZVwiXTtcclxuXHJcbnZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIEhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcFwiLCB7XHJcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwibGF5b3V0LWFwcC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJhcHBDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImFwcEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgY3VycmVudHVzZXI6IFtcImN1cnJlbnRVc2VyU2VydmljZVwiLCBmdW5jdGlvbiAoY3VycmVudFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyU2VydmljZS5nZXQoKTtcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBhcHBQYXJhbWV0ZXJzIDogWyBcInBhcmFtZXRlclNlcnZpY2VcIiwgZnVuY3Rpb24gKHBhcmFtZXRlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1ldGVyU2VydmljZS5xdWVyeSgpO1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAuZGFzaGJvYXJkXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJkYXNoYm9hcmRDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImRhc2hib2FyZEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiZGFzaGJvYXJkXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvZmlsXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvZmlsL3Byb2ZpbC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJwcm9maWxDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcInByb2ZpbEN0cmxcIixcclxuICAgICAgICB1cmw6IFwicHJvZmlsXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJsb2dpblwiLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwibG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImxvZ2luXCIsXHJcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiXHJcbiAgICB9KTtcclxuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goYXV0aFRva2VuSHR0cEludGVyY2VwdG9yKTtcclxuICAgIEhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyLnRyYW5zZm9ybUFsbFJlc3BvbnNlcygpO1xyXG59O1xyXG5jb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJGh0dHBQcm92aWRlclwiLCBcIkhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyXCJdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcblxyXG4iLCJ2YXIgYXBwQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkaHR0cCwgY3VycmVudHVzZXIsIHNjb3BlLCAkc2Vzc2lvblN0b3JhZ2UsICRzdGF0ZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmN1cnJlbnR1c2VyID0gY3VycmVudHVzZXI7XHJcbiAgICBjdXJyZW50dXNlci4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjdXJyZW50dXNlci5wcm9qZWN0cyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwicHJvamVjdFwiKS5xdWVyeSgpO1xyXG4gICAgICAgIGlmIChjdXJyZW50dXNlci5fbGlua3MucGhvdG8pIHtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGN1cnJlbnR1c2VyLl9saW5rcy5waG90bykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50dXNlci5waG90byA9IHJlc3VsdC5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgfSk7XHJcbiAgICB2bS5yZWRpcmVjdFRhc2sgPSBmdW5jdGlvbiAoJGl0ZW0sICRtb2RlbCwgJGxhYmVsKSB7XHJcbiAgICAgICAgcHJvamVjdCA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwicHJvamVjdFwiKS5xdWVyeSh7dGFza0lkOiAkbW9kZWwuaWR9KS4kcHJvbWlzZTtcclxuICAgICAgICBwcm9qZWN0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwiYXBwLnByb2plY3QudGFza1wiLCAoe3Byb2plY3RJZDogcHJvamVjdC4kJHN0YXRlLnZhbHVlWzBdLmlkLCB0YXNrSWQ6ICRtb2RlbC5pZH0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2bS5zZWFyY2hlZFRhc2sgPSBudWxsO1xyXG4gICAgfTtcclxuICAgIHZtLmdldFRhc2tzID0gZnVuY3Rpb24gKHRlcm0pIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudHVzZXIucmVzb3VyY2UoXCJzZWFyY2hcIikucXVlcnkoe3NlYXJjaDogdGVybX0pLiRwcm9taXNlO1xyXG4gICAgfTtcclxuXHJcbiAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGVsZXRlICRzZXNzaW9uU3RvcmFnZS5vYXV0aDtcclxuICAgICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwibG9naW5cIik7XHJcbiAgICB9O1xyXG4gICAgc2NvcGUuJG9uKFwia2FuYmFuOnByb2plY3RzLXVwZGF0ZXNcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN1cnJlbnR1c2VyLnByb2plY3RzID0gY3VycmVudHVzZXIucmVzb3VyY2UoXCJwcm9qZWN0XCIpLnF1ZXJ5KCk7XHJcbiAgICB9KTtcclxufTtcclxuYXBwQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCJjdXJyZW50dXNlclwiLCBcIiRzY29wZVwiLCBcIiRzZXNzaW9uU3RvcmFnZVwiLCBcIiRzdGF0ZVwiXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXBwQ29udHJvbGxlcjtcclxuIiwiXHJcbnZhciBhcHBDb25maWcgPSByZXF1aXJlKFwiLi9hcHAuY29uZmlnXCIpO1xyXG52YXIgYXBwUnVuID0gcmVxdWlyZShcIi4vYXBwLnJ1blwiKTtcclxudmFyIGxvZ2luTW9kdWxlID0gcmVxdWlyZShcIi4vbG9naW4vbG9naW4ubW9kdWxlXCIpO1xyXG52YXIgYXBwQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FwcC5jb250cm9sbGVyXCIpO1xyXG52YXIgZGFzaGJvYXJkTW9kdWxlID0gcmVxdWlyZShcIi4vZGFzaGJvYXJkL2Rhc2hib2FyZC5tb2R1bGVcIik7XHJcbnZhciBwcm9qZWN0TW9kdWxlID0gcmVxdWlyZShcIi4vcHJvamVjdC9wcm9qZWN0Lm1vZHVsZVwiKTtcclxudmFyIHNhbWVQYXNzd29yZERpcmVjdGl2ZSA9IHJlcXVpcmUoXCIuL2RpcmVjdGl2ZS9zYW1lUGFzc3dvcmQuZGlyZWN0aXZlXCIpO1xyXG52YXIgY2hlY2tib3hGaWx0ZXJEaXJlY3RpdmUgPSByZXF1aXJlKFwiLi9kaXJlY3RpdmUvY2hlY2tib3hmaWx0ZXIuZGlyZWN0aXZlXCIpO1xyXG52YXIgZXJyb3JEaXJlY3RpdmUgPSByZXF1aXJlKFwiLi9kaXJlY3RpdmUvZXJyb3IuZGlyZWN0aXZlXCIpO1xyXG52YXIgdG9nZ2xlckRpcmVjdGl2ZSA9IHJlcXVpcmUoXCIuL2RpcmVjdGl2ZS90b2dnbGVyLmRpcmVjdGl2ZVwiKTtcclxudmFyIGFkbWluTW9kdWxlID0gcmVxdWlyZShcIi4vYWRtaW4vYWRtaW4ubW9kdWxlXCIpO1xyXG52YXIgcHJvZmlsQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL3Byb2ZpbC9wcm9maWwuY29udHJvbGxlclwiKTtcclxudmFyIHBhcmFtZXRlck1vZHVsZSA9IHJlcXVpcmUoXCIuL3BhcmFtZXRlci9wYXJhbWV0ZXIubW9kdWxlXCIpO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJrYW5iYW5cIixcclxuICAgICAgICBbXCJ1aS5yb3V0ZXJcIiwgXCJuZ1N0b3JhZ2VcIiwgXCJuZ1Nhbml0aXplXCIsIFwidWkuc29ydGFibGVcIiwgXCJhbmd1bGFyTW9tZW50XCIsXHJcbiAgICAgICAgICAgIFwiaHR0cC1hdXRoLWludGVyY2VwdG9yXCIsIFwieGVkaXRhYmxlXCIsIFwibmdSZXNvdXJjZVwiLFxyXG4gICAgICAgICAgICBcImhhdGVvYXNcIiwgXCJ1aS5ib290c3RyYXBcIiwgXCJ1aS5ib290c3RyYXAudHBsc1wiLCBcIm5nSW1nQ3JvcFwiLCBcInRleHRBbmd1bGFyXCIsIFwiaW5maW5pdGUtc2Nyb2xsXCIsXHJcbiAgICAgICAgICAgIGxvZ2luTW9kdWxlLm5hbWUsIGRhc2hib2FyZE1vZHVsZS5uYW1lLFxyXG4gICAgICAgICAgICBwcm9qZWN0TW9kdWxlLm5hbWUsIGFkbWluTW9kdWxlLm5hbWUsIHBhcmFtZXRlck1vZHVsZS5uYW1lXSlcclxuICAgICAgICAuY29uZmlnKGFwcENvbmZpZylcclxuICAgICAgICAucnVuKGFwcFJ1bilcclxuICAgICAgICAuY29udHJvbGxlcihcImFwcENvbnRyb2xsZXJcIiwgYXBwQ29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcInByb2ZpbENvbnRyb2xsZXJcIiwgcHJvZmlsQ29udHJvbGxlcilcclxuICAgICAgICAuZGlyZWN0aXZlKFwiY2hlY2tib3hGaWx0ZXJcIiwgY2hlY2tib3hGaWx0ZXJEaXJlY3RpdmUpXHJcbiAgICAgICAgLmRpcmVjdGl2ZShcInNhbWVQYXNzd29yZFwiLCBzYW1lUGFzc3dvcmREaXJlY3RpdmUpXHJcbiAgICAgICAgLmRpcmVjdGl2ZShcImVycm9yc1wiLCBlcnJvckRpcmVjdGl2ZSlcclxuICAgICAgICAuZGlyZWN0aXZlKFwidG9nZ2xlclwiLCB0b2dnbGVyRGlyZWN0aXZlKTtcclxuXHJcbiIsIi8qIFxyXG4gKiBUbyBjaGFuZ2UgdGhpcyBsaWNlbnNlIGhlYWRlciwgY2hvb3NlIExpY2Vuc2UgSGVhZGVycyBpbiBQcm9qZWN0IFByb3BlcnRpZXMuXHJcbiAqIFRvIGNoYW5nZSB0aGlzIHRlbXBsYXRlIGZpbGUsIGNob29zZSBUb29scyB8IFRlbXBsYXRlc1xyXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cclxuICovXHJcblxyXG52YXIgYXBwUnVuID0gZnVuY3Rpb24gKCRyb290U2NvcGUsICRzZXNzaW9uU3RvcmFnZSwgJHN0YXRlLCAkdWliTW9kYWwsIGF1dGhTZXJ2aWNlLCBlZGl0YWJsZU9wdGlvbnMpIHtcclxuICAgIGVkaXRhYmxlT3B0aW9ucy50aGVtZSA9ICdiczMnO1xyXG4gICAgJHJvb3RTY29wZS5sb2dpbk9uZ29pbmcgPSBmYWxzZTtcclxuICAgICRyb290U2NvcGUuJG9uKFwiZXZlbnQ6YXV0aC1mb3JiaWRkZW5cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzdGF0ZS5nbyhcImFwcC5kYXNoYm9hcmRcIik7XHJcbiAgICB9KTtcclxuICAgICRyb290U2NvcGUuJG9uKFwiZXZlbnQ6YXV0aC1sb2dpblJlcXVpcmVkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkZWxldGUgJHNlc3Npb25TdG9yYWdlLm9hdXRoO1xyXG4gICAgICAgIHZhciBtb2RhbFNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgaWYgKCEkcm9vdFNjb3BlLmxvZ2luT25nb2luZykge1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2luT25nb2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGJhY2tkcm9wOiBcInN0YXRpY1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwibG9naW4uaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJsb2dpblwiLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IG1vZGFsU2NvcGUsXHJcbiAgICAgICAgICAgICAgICBrZXlib2FyZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1vZGFsU2NvcGUubW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luQ29uZmlybWVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUubG9naW5PbmdvaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlLmdvKFwibG9naW5cIik7XHJcbn07XHJcbmFwcFJ1bi4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiRzZXNzaW9uU3RvcmFnZVwiLCBcIiRzdGF0ZVwiLCBcIiR1aWJNb2RhbFwiLCBcImF1dGhTZXJ2aWNlXCIsIFwiZWRpdGFibGVPcHRpb25zXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcFJ1bjtcclxuXHJcblxyXG4iLCJ2YXIgYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSxhbGxvY2F0aW9uU2VydmljZSwgZGF5LCBjdXJyZW50dXNlciwgYXBwUGFyYW1ldGVycykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmRheSA9IGRheTtcclxuICAgIHZtLmFsbG9jYXRpb25zID0gYWxsb2NhdGlvblNlcnZpY2UubG9hZEFsbG9jYXRpb24oYXBwUGFyYW1ldGVycyk7XHJcbiAgICAvLyBuZWVkIHRvIG11bHRpcHkgYnkgMTAwMCBmb3IgZ2V0IFVOSVggVGltZXN0YW1wXHJcbiAgICB2bS5pbXB1dGF0aW9ucyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwiY29uc29tbWF0aW9uXCIpLnF1ZXJ5KHtkYXRlOiBkYXkuZm9ybWF0KFwiWFwiKSAqIDEwMDB9KTtcclxuICAgIHZtLmFkZFRhc2sgPSBmdW5jdGlvbiAoJGl0ZW0sICRtb2RlbCwgJGxhYmVsKSB7XHJcbiAgICAgICAgdmFyIG5ld0ltcHV0YXRpb24gPSB7XHJcbiAgICAgICAgICAgIHRhc2tOYW1lOiAkbW9kZWwubmFtZSxcclxuICAgICAgICAgICAgdGFza0lkOiAkbW9kZWwuaWQsXHJcbiAgICAgICAgICAgIHRpbWVSZW1haW5zOiAkbW9kZWwudGltZVJlbWFpbnMsXHJcbiAgICAgICAgICAgIHRpbWVTcGVudDogMFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIHRhc2tBbHJlYWR5QWRkZWQgPSBmYWxzZTtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2godm0uaW1wdXRhdGlvbnMsIGZ1bmN0aW9uIChpbXB1dGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdJbXB1dGF0aW9uLnRhc2tJZCA9PT0gaW1wdXRhdGlvbi50YXNrSWQpIHtcclxuICAgICAgICAgICAgICAgIHRhc2tBbHJlYWR5QWRkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCF0YXNrQWxyZWFkeUFkZGVkKSB7XHJcbiAgICAgICAgICAgIHZtLmltcHV0YXRpb25zLnB1c2gobmV3SW1wdXRhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZtLmFkZGVkVGFzayA9IG51bGw7XHJcbiAgICB9O1xyXG4gICAgdm0uZ2V0VGFza3MgPSBmdW5jdGlvbiAodGVybSkge1xyXG4gICAgICAgIHJldHVybiBjdXJyZW50dXNlci5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoe3NlYXJjaDogdGVybX0pLiRwcm9taXNlO1xyXG4gICAgfTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBuZWVkIHRvIG11bHRpcHkgYnkgMTAwMCBmb3IgZ2V0IFVOSVggVGltZXN0YW1wXHJcbiAgICAgICAgY3VycmVudHVzZXIucmVzb3VyY2UoXCJjb25zb21tYXRpb25cIikuc2F2ZSh7ZGF0ZTogZGF5LmZvcm1hdChcIlhcIikgKiAxMDAwfSwgdm0uaW1wdXRhdGlvbnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIixcImFsbG9jYXRpb25TZXJ2aWNlXCIsIFwiZGF5XCIsIFwiY3VycmVudHVzZXJcIiwgXCJhcHBQYXJhbWV0ZXJzXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwiXHJcbnZhciBkYXNoYm9hcmRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgSGF0ZW9hc0ludGVyZmFjZSwgY3VycmVudHVzZXIsIHRhc2tBc3NlbWJsZXJTZXJ2aWNlLCB1aUNhbGVuZGFyQ29uZmlnLCBtb21lbnQsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS50YXNrcyA9IHtcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIHNpemU6IDEwLFxyXG4gICAgICAgICAgICBudW1iZXI6IDFcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY3VycmVudHVzZXIuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnRhc2tzID0gY3VycmVudHVzZXIucmVzb3VyY2UoXCJ0YXNrXCIpLmdldChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHZtLnRhc2tzLnBhZ2UubnVtYmVyIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogdm0udGFza3MucGFnZS5zaXplXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLl9lbWJlZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLl9lbWJlZGRlZC50YXNrUmVzb3VyY2VMaXN0LCBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGFza0Fzc2VtYmxlclNlcnZpY2UodGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sucHJvamVjdCA9IG5ldyBIYXRlb2FzSW50ZXJmYWNlKHRhc2spLnJlc291cmNlKFwicHJvamVjdFwiKS5nZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGEucGFnZS5udW1iZXIrKztcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdm0uY2FsZW5kYXJPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXHJcbiAgICAgICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsYW5nOiBcImZyXCIsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAndGl0bGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogJycsXHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICd0b2RheSBwcmV2LG5leHQnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdmlld1JlbmRlcjogZnVuY3Rpb24gKHZpZXcsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBtb21lbnQodmlldy5zdGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuZCA9IG1vbWVudCh2aWV3LmVuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbmVlZCB0byBtdWx0aXB5IGJ5IDEwMDAgZm9yIGdldCBVTklYIFRpbWVzdGFtcFxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRDYWxlbmRhckV2ZW50KHN0YXJ0LmZvcm1hdChcIlhcIikgKiAxMDAwLCBlbmQuZm9ybWF0KFwiWFwiKSAqIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGRheUNsaWNrOiBkYXlPbkNsaWNrXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0ubG9hZENhbGVuZGFyRXZlbnQgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xyXG4gICAgICAgIGN1cnJlbnR1c2VyLnJlc291cmNlKFwidGFza1wiKS5xdWVyeSh7c3RhcnQ6IHN0YXJ0LCBlbmQ6IGVuZH0sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrID0gdGFza0Fzc2VtYmxlclNlcnZpY2UodGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2sudGl0bGUgPSB0YXNrLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suc3RhcnQgPSBtb21lbnQodGFzay5wbGFubmVkU3RhcnQpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmVuZCA9IG1vbWVudCh0YXNrLnBsYW5uZWRFbmRpbmcpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmFsbERheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLl9saW5rcy5jYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5jYXRlZ29yeS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmJhY2tncm91bmRDb2xvciA9IHRhc2suY2F0ZWdvcnkuYmdjb2xvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aUNhbGVuZGFyQ29uZmlnLmNhbGVuZGFycy51c2VyQ2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXJFdmVudCcsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aUNhbGVuZGFyQ29uZmlnLmNhbGVuZGFycy51c2VyQ2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXJFdmVudCcsIHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBjdXJyZW50dXNlci4kcHJvbWlzZS50aGVuKGxvYWQpO1xyXG4gICAgZGF5T25DbGljayA9IGZ1bmN0aW9uIChkYXkpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZGFzaGJvYXJkL2NhbGVuZGFyL2ltcHV0YXRpb24uaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZEltcHV0YXRpb25Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRJbXB1dGF0aW9uQ3RybFwiLFxyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnR1c2VyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnR1c2VyO1xyXG4gICAgICAgICAgICAgICAgfSwgXHJcbiAgICAgICAgICAgICAgICBhcHBQYXJhbWV0ZXJzIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcFBhcmFtZXRlcnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4obG9hZCk7XHJcbiAgICB9O1xyXG4gICAgdm0uZXZlbnRzU291cmNlID0gW107XHJcbn07XHJcbmRhc2hib2FyZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIiwgXCJjdXJyZW50dXNlclwiLCBcInRhc2tBc3NlbWJsZXJTZXJ2aWNlXCIsIFwidWlDYWxlbmRhckNvbmZpZ1wiLCBcIm1vbWVudFwiLCBcImFwcFBhcmFtZXRlcnNcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZGFzaGJvYXJkQ29udHJvbGxlcjtcclxuIiwidmFyIGRhc2hib2FyZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9kYXNoYm9hcmQuY29udHJvbGxlclwiKTtcclxudmFyIGFkZEltcHV0YXRpb25Db250cm9sbGVyID0gcmVxdWlyZShcIi4vY2FsZW5kYXIvYWRkaW1wdXRhdGlvbi5jb250cm9sbGVyXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4uZGFzaGJvYXJkJywgW1widWkuY2FsZW5kYXJcIl0pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJkYXNoYm9hcmRDb250cm9sbGVyXCIsIGRhc2hib2FyZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRJbXB1dGF0aW9uQ29udHJvbGxlclwiLCBhZGRJbXB1dGF0aW9uQ29udHJvbGxlcik7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHNjb3BlOiB7ZmlsdGVyVGl0bGU6ICdAJ30sXHJcbiAgICAgICAgdGVtcGxhdGU6ICAgJzxkaXYgY2xhc3M9XCJjaGVja2JveERyb3Bkb3duXCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICsnPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc21cIiBuZy1jbGljaz1cInRvZ2dsZSgpXCI+IHt7ZmlsdGVyVGl0bGV9fSA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPjwvYnV0dG9uPidcclxuICAgICAgICAgICAgICAgICAgICArJzxkaXYgY2xhc3M9XCJjaGVja2JveERyb3Bkb3duX19maWx0ZXJzXCIgbmctY2xhc3M9XCJ7XFwnY2hlY2tib3hEcm9wZG93bl9fZmlsdGVycy0tc2hvd1xcJzogdG9nZ2xlZH1cIj48bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+PC9kaXY+J1xyXG4gICAgICAgICAgICAgICAgICAgICsnPC9kaXY+JyxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLnRvZ2dsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2NvcGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUudG9nZ2xlZCA9ICFzY29wZS50b2dnbGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIGVycm9yczogXCI9ZXJyb3JzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPHVsPiAnXHJcbiAgICAgICAgICAgICAgICArICc8bGkgbmctcmVwZWF0PVwibXNnIGluIGVycm9ycy5tZXNzYWdlc1wiPidcclxuICAgICAgICAgICAgICAgICsgJ3t7bXNnLm1lc3NhZ2V9fSdcclxuICAgICAgICAgICAgICAgICsgJzwvbGk+J1xyXG4gICAgICAgICAgICAgICAgKyAnPC91bD4nXHJcbiAgICB9O1xyXG59O1xyXG4iLCJcclxudmFyIGNoZWNrU2FtZVBhc3N3b3JkID0gZnVuY3Rpb24gKHBhc3N3b3JkLCByZVBhc3N3b3JkKSB7XHJcbiAgICB2YXIgZXJyb3IgPSBudWxsO1xyXG4gICAgaWYgKHJlUGFzc3dvcmQgIT09ICcnICYmXHJcbiAgICAgICAgICAgIHBhc3N3b3JkICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgICAgJiYgcmVQYXNzd29yZCAhPT0gcGFzc3dvcmQpIHtcclxuICAgICAgICBlcnJvciA9IHtcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJMZXMgbW90cyBkZSBwYXNzZSBzYWlzaXMgbmUgY29ycmVzcG9uZGVudCBwYXNcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXJyb3I7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBwYXNzd29yZDogXCI9cGFzc3dvcmRcIixcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiQHBsYWNlaG9sZGVyXCIsXHJcbiAgICAgICAgICAgIGVycm9yOiBcIj1lcnJvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBjdHJsKSB7XHJcbiAgICAgICAgICAgIHZhciByZVBhc3N3b3JkRWxtID0gZWxlbS5jaGlsZHJlbigpWzBdO1xyXG4gICAgICAgICAgICBlbGVtLmFkZChzY29wZS5wYXNzd29yZCkub24oJ2tleXVwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuZXJyb3IgPSBjaGVja1NhbWVQYXNzd29yZChzY29wZS5wYXNzd29yZCwgcmVQYXNzd29yZEVsbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgncGFzc3dvcmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVQYXNzd29yZEVsbS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmVycm9yID0gY2hlY2tTYW1lUGFzc3dvcmQoc2NvcGUucGFzc3dvcmQsIHJlUGFzc3dvcmRFbG0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgaWQ9XCJyZVBhc3N3b3JkXCIgcGxhY2Vob2xkZXI9XCJ7e3BsYWNlaG9sZGVyfX1cIi8+J1xyXG4gICAgfTtcclxufTsiLCJcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiBcIkFcIixcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICB0b2dnbGVDbGFzczogJ0AnLFxyXG4gICAgICAgICAgICB0b2dnbGVBY3RpdmU6ICc9J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtKSB7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS50b2dnbGVBY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGVsZW0pLnBhcmVudCgpLnRvZ2dsZUNsYXNzKHNjb3BlLnRvZ2dsZUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTsiLCIvKiBcclxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxyXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcclxuICogYW5kIG9wZW4gdGhlIHRlbXBsYXRlIGluIHRoZSBlZGl0b3IuXHJcbiAqL1xyXG52YXIgYXBwQXV0aFNlcnZpY2UgPSBmdW5jdGlvbiBhcHBBdXRoU2VydmljZSgkaHR0cCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2dpbjogZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9vYXV0aC90b2tlblwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IFwiQmFzaWMgXCIgKyBidG9hKFwiY2xpZW50YXBwOjEyMzQ1NlwiKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBjcmVkZW50aWFscy51c2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogY3JlZGVudGlhbHMucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiBcInJlYWQgd3JpdGVcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoY29uZmlnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5hcHBBdXRoU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYXBwQXV0aFNlcnZpY2U7IiwidmFyIHVzZXJQcm9maWxlID0gZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZShcIi9hcGkvdXNlclByb2ZpbGVcIik7XHJcbn07XHJcbnVzZXJQcm9maWxlLiRpbmplY3QgPSBbXCIkcmVzb3VyY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclByb2ZpbGU7XHJcbiIsInZhciBsb2dpbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoc2NvcGUsICRzdGF0ZSwgJHNlc3Npb25TdG9yYWdlLCBhcHBBdXRoU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmF1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHBBdXRoU2VydmljZS5sb2dpbih2bS5sb2dpbkZvcm0pLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAkc2Vzc2lvblN0b3JhZ2Uub2F1dGggPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIGlmIChzY29wZS5tb2RhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImFwcC5kYXNoYm9hcmRcIik7XHJcbiAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5sb2dpbkZvcm0gPSB7fTtcclxuICAgICAgICAgICAgdm0ubG9naW5Gb3JtLmVycm9yID0gXCJMb2dpbi9wYXNzd29yZCBpbnZhbGlkZVwiO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxubG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkc2Vzc2lvblN0b3JhZ2VcIiwgXCJhcHBBdXRoU2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsb2dpbkNvbnRyb2xsZXI7IiwidmFyIGxvZ2luQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xvZ2luLmNvbnRyb2xsZXJcIik7XHJcbnZhciBhcHBBdXRoU2VydmljZSA9IHJlcXVpcmUoXCIuL2F1dGguc2VydmljZVwiKTtcclxudmFyIGN1cnJlbnRVc2VyU2VydmljZSA9IHJlcXVpcmUoXCIuL2N1cnJlbnR1c2VyLnNlcnZpY2VcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5sb2dpbicsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibG9naW5Db250cm9sbGVyXCIsIGxvZ2luQ29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcImFwcEF1dGhTZXJ2aWNlXCIsIGFwcEF1dGhTZXJ2aWNlKVxyXG4gICAgICAgIC5zZXJ2aWNlKFwiY3VycmVudFVzZXJTZXJ2aWNlXCIsIGN1cnJlbnRVc2VyU2VydmljZSk7XHJcbiIsInZhciBhbGxvY2F0aW9uU2VydmljZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZEFsbG9jYXRpb246IGZ1bmN0aW9uIChhcHBQYXJhbWV0ZXJzKSB7XHJcbiAgICAgICAgICAgIHZhciBhbGxvY2F0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFwcFBhcmFtZXRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcHBQYXJhbWV0ZXJzW2ldLmNhdGVnb3J5ID09PSAnQUxMT0NBVElPTicpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFwcFBhcmFtZXRlcnNbaV0ucGFyYW1ldGVyLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbG9jYXRpb25zW2FwcFBhcmFtZXRlcnNbaV0ucGFyYW1ldGVyW2pdLmtleVBhcmFtXSA9IGFwcFBhcmFtZXRlcnNbaV0ucGFyYW1ldGVyW2pdLnZhbHVlUGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhbGxvY2F0aW9ucztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5hbGxvY2F0aW9uU2VydmljZS4kaW5qZWN0ID0gW107XHJcbm1vZHVsZS5leHBvcnRzID0gYWxsb2NhdGlvblNlcnZpY2U7XHJcbiIsIlxyXG52YXIgbGlzdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBwYXJhbWV0ZXJTZXJ2aWNlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc2F2ZVBhcmFtZXRlciA9IGZ1bmN0aW9uIChwYXJhbWV0ZXIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gcGFyYW1ldGVyU2VydmljZS5zYXZlKHBhcmFtZXRlcikuJHByb21pc2U7XHJcbiAgICAgICAgcmVzdWx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZtLnBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJTZXJ2aWNlLnF1ZXJ5KCk7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkKCk7XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCJwYXJhbWV0ZXJTZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyO1xyXG5cclxuIiwidmFyIGNvbmZpZyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucGFyYW1ldGVyXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcGFyYW1ldGVyL2xpc3QuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFBhcmFtZXRlckFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJwYXJhbWV0ZXJDdHJsXCIsXHJcbiAgICAgICAgdXJsOiBcInBhcmFtZXRlclwiXHJcbiAgICB9KTtcclxufTtcclxuY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi9wYXJhbWV0ZXIuY29uZmlnXCIpO1xyXG52YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBwYXJhbWV0ZXJTZXJ2aWNlID0gcmVxdWlyZShcIi4vcGFyYW1ldGVyLnNlcnZpY2VcIik7XHJcbnZhciBhbGxvY2F0aW9uU2VydmljZSA9IHJlcXVpcmUoXCIuL2FsbG9jYXRpb24uc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnBhcmFtZXRlcicsIFtdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFBhcmFtZXRlckFkbWluQ29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcInBhcmFtZXRlclNlcnZpY2VcIiwgcGFyYW1ldGVyU2VydmljZSlcclxuICAgICAgICAuc2VydmljZShcImFsbG9jYXRpb25TZXJ2aWNlXCIsIGFsbG9jYXRpb25TZXJ2aWNlKTsiLCJ2YXIgcGFyYW1ldGVyU2VydmljZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3BhcmFtZXRlci86Y2F0ZWdvcnkvOmtleVwiLCB7Y2F0ZWdvcnk6IFwiQGNhdGVnb3J5XCIsIGtleTogXCJAa2V5UGFyYW1cIn0pO1xyXG59O1xyXG5wYXJhbWV0ZXJTZXJ2aWNlLiRpbmplY3QgPSBbXCIkcmVzb3VyY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gcGFyYW1ldGVyU2VydmljZTtcclxuIiwidmFyIHByb2ZpbENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoc2NvcGUsICRodHRwLCBjdXJyZW50dXNlcikge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLm5ld1Bob3RvID0gJyc7XHJcbiAgICBjdXJyZW50dXNlci4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5wcm9maWwgPSBjdXJyZW50dXNlcjtcclxuICAgICAgICBpZiAoY3VycmVudHVzZXIuX2xpbmtzLm1lbWJlcikge1xyXG4gICAgICAgICAgICB2bS5wcm9maWwubWVtYmVycyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwibWVtYmVyXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB2YXIgaGFuZGxlRmlsZVNlbGVjdCA9IGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICB2YXIgZmlsZSA9IGV2dC5jdXJyZW50VGFyZ2V0LmZpbGVzWzBdO1xyXG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5waG90b1RlbXAgPSBldnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgIH07XHJcbiAgICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Bob3RvUHJvZmlsJykpLm9uKCdjaGFuZ2UnLCBoYW5kbGVGaWxlU2VsZWN0KTtcclxuICAgIHZtLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF2bS5lcnJvcikge1xyXG4gICAgICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaWRcIiwgdm0ucHJvZmlsLmlkKTtcclxuICAgICAgICAgICAgaWYgKHZtLnByb2ZpbC5wYXNzd29yZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwYXNzd29yZFwiLCB2bS5wcm9maWwucGFzc3dvcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImVtYWlsXCIsIHZtLnByb2ZpbC5lbWFpbCk7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInBob3RvXCIsIHZtLm5ld1Bob3RvKTtcclxuICAgICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogY3VycmVudHVzZXIuX2xpbmtzLnNlbGYsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkfSxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHlcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnR1c2VyLnBob3RvID0gdm0ubmV3UGhvdG87XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbnByb2ZpbENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRodHRwXCIsIFwiY3VycmVudHVzZXJcIl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHByb2ZpbENvbnRyb2xsZXI7IiwidmFyIGNvbmZpZyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC5jb25zb21tYXRpb25cIiwge1xyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwiY29uc29tbWF0aW9uQ29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJjb25zb21tYXRpb25DdHJsXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvY29uc29tbWF0aW9uL21lbWJlci5odG1sXCIsXHJcbiAgICAgICAgdXJsOiBcImNvbnNvbW1hdGlvblwiXHJcbiAgICB9KTtcclxufTtcclxuY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsImZ1bmN0aW9uIGdldFdlZWtEYXlzKG1vbWVudCwgc3RhcnQpIHtcclxuICAgIHZhciBkYXlzID0gW107XHJcbiAgICB2YXIgZGF5ID0gbW9tZW50KHN0YXJ0KTtcclxuICAgIC8vT24gbidhZmZpY2hlIHF1ZSBsZXMgam91cnMgb3V2ZXJ0c1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA3OyBpKyspIHtcclxuICAgICAgICBkYXlzLnB1c2goZGF5KTtcclxuICAgICAgICBkYXkgPSBtb21lbnQoZGF5KS5hZGQoMSwgJ2RheXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb250aERheXMobW9tZW50LCBzdGFydCwgbW9udGgpIHtcclxuICAgIHZhciBkYXlzID0gW107XHJcbiAgICB2YXIgZGF5ID0gbW9tZW50KHN0YXJ0KTtcclxuICAgIHdoaWxlIChkYXkubW9udGgoKSA9PT0gbW9udGgpIHtcclxuICAgICAgICAvL09uIG4nYWZmaWNoZSBxdWUgbGVzIGpvdXJzIG91dmVydHNcclxuICAgICAgICBkYXlzLnB1c2goZGF5KTtcclxuICAgICAgICBkYXkgPSBtb21lbnQoZGF5KS5hZGQoMSwgJ2RheXMnKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXlzO1xyXG59XHJcblxyXG52YXIgY29uc29tYXRpb25Db250cm9sbGVyID0gZnVuY3Rpb24gKG1vbWVudCwgcHJvamVjdCwgY29uc29tYXRpb25TZXJ2aWNlLCBhbGxvY2F0aW9uU2VydmljZSwgYXBwUGFyYW1ldGVycykge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnByZWNpc2lvbiA9IFwid2Vla1wiO1xyXG4gICAgdm0uc3RhcnQgPSBtb21lbnQoKS5zdGFydE9mKCdpc29XZWVrJyk7XHJcbiAgICB2bS5hbGxvY2F0aW9ucyA9IHt9O1xyXG4gICAgdmFyIGVuZCA9IG1vbWVudCh2bS5zdGFydCk7XHJcbiAgICB2bS5zaG93RGV0YWlsID0gZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgZW50cnkuc2hvd0RldGFpbHMgPSB0cnVlO1xyXG4gICAgfTtcclxuICAgIHZtLmhpZGVEZXRhaWwgPSBmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICBlbnRyeS5zaG93RGV0YWlscyA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIHZtLnByZWNpc2lvbkNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5kYXlzID0gW107XHJcbiAgICAgICAgaWYgKHZtLnByZWNpc2lvbiA9PT0gXCJ3ZWVrXCIpIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5zdGFydE9mKCdpc29XZWVrJyk7XHJcbiAgICAgICAgICAgIHZtLmRheXMgPSBnZXRXZWVrRGF5cyhtb21lbnQsIHZtLnN0YXJ0KTtcclxuICAgICAgICAgICAgZW5kID0gbW9tZW50KHZtLnN0YXJ0KS5hZGQoOCwgJ2RheXMnKTtcclxuICAgICAgICAgICAgdm0uZW50cmllcyA9IGNvbnNvbWF0aW9uU2VydmljZS5sb2FkQ29uc29tbWF0aW9ucyhwcm9qZWN0LCB2bS5zdGFydCwgZW5kKTtcclxuICAgICAgICAgICAgdm0uZW50cmllcy4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbWF0aW9uU2VydmljZS5jaGVja01pc3NpbmdCeURheSh2bS5lbnRyaWVzLCBhcHBQYXJhbWV0ZXJzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgICAgICAgICB2bS5kYXlzID0gZ2V0TW9udGhEYXlzKG1vbWVudCwgdm0uc3RhcnQsIHZtLnN0YXJ0Lm1vbnRoKCkpO1xyXG4gICAgICAgICAgICBlbmQgPSBtb21lbnQodm0uc3RhcnQpLmFkZCgxLCAnbW9udGhzJyk7XHJcbiAgICAgICAgICAgIHZtLmVudHJpZXMgPSBjb25zb21hdGlvblNlcnZpY2UubG9hZENvbnNvbW1hdGlvbnMocHJvamVjdCwgdm0uc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgICAgIC8vVE9ETyBSZWdyb3VwZSBwYXIgc2VtYWluZSB2bS5kYXlzIGV0IHZtLmVudHJpZXNcclxuICAgICAgICAgICAgdm0uZW50cmllcy4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBncm91cGVkID0gY29uc29tYXRpb25TZXJ2aWNlLmdyb3VwQnlXZWVrKHZtLmVudHJpZXMsIHZtLmRheXMpO1xyXG4gICAgICAgICAgICAgICAgdm0uZW50cmllcyA9IGdyb3VwZWQuZW50cmllcztcclxuICAgICAgICAgICAgICAgIHZtLmRheXMgPSBncm91cGVkLndlZWtzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdm0ucHJldmlvdXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHZtLnByZWNpc2lvbiA9PT0gXCJ3ZWVrXCIpIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5zdWJ0cmFjdCg3LCBcImRheXNcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5zdWJ0cmFjdCgxLCBcIm1vbnRoc1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdm0ucHJlY2lzaW9uQ2hhbmdlKCk7XHJcbiAgICB9O1xyXG4gICAgdm0ubmV4dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodm0ucHJlY2lzaW9uID09PSBcIndlZWtcIikge1xyXG4gICAgICAgICAgICB2bS5zdGFydCA9IHZtLnN0YXJ0LmFkZCg3LCBcImRheXNcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5hZGQoMSwgXCJtb250aHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZtLnByZWNpc2lvbkNoYW5nZSgpO1xyXG4gICAgfTtcclxuICAgIHZtLmNoZWNrQWxsb2NhdGlvbiA9IGZ1bmN0aW9uIChhbGxvY2F0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIGFsbG9jYXRpb24gPT09IHZtLm1heC52YWx1ZTtcclxuICAgIH07XHJcbiAgICB2bS5wcmVjaXNpb25DaGFuZ2UoKTtcclxufTtcclxuY29uc29tYXRpb25Db250cm9sbGVyLiRpbmplY3QgPSBbXCJtb21lbnRcIiwgXCJwcm9qZWN0XCIsIFwiY29uc29tYXRpb25TZXJ2aWNlXCIsIFwiYWxsb2NhdGlvblNlcnZpY2VcIiwgXCJhcHBQYXJhbWV0ZXJzXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbWF0aW9uQ29udHJvbGxlcjsiLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vY29uc29tbWF0aW9uLmNvbmZpZ1wiKTtcclxudmFyIGNvbnNvbW1hdGlvbkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9jb25zb21tYXRpb24uY29udHJvbGxlclwiKTtcclxudmFyIGNvbnNvU2VydmljZSA9IHJlcXVpcmUoXCIuL2NvbnNvbW1hdGlvbi5zZXJ2aWNlXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4ucHJvamVjdC5jb25zb21tYXRpb24nLCBbXSlcclxuICAgICAgICAuY29uZmlnKGNvbmZpZylcclxuICAgICAgICAuY29udHJvbGxlcihcImNvbnNvbW1hdGlvbkNvbnRyb2xsZXJcIiwgY29uc29tbWF0aW9uQ29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcImNvbnNvbWF0aW9uU2VydmljZVwiLCBjb25zb1NlcnZpY2UpOyIsImZ1bmN0aW9uIGdyb3VwV2Vla3MoZGF5cykge1xyXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgdmFyIHdlZWtzID0gW107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB2YXIgY3VycmVudFdlZWs7XHJcbiAgICBhbmd1bGFyLmZvckVhY2goZGF5cywgZnVuY3Rpb24gKGRheSkge1xyXG4gICAgICAgIGlmICghY3VycmVudFdlZWsgfHwgZGF5LndlZWsoKSAhPT0gY3VycmVudFdlZWspIHtcclxuICAgICAgICAgICAgY3VycmVudFdlZWsgPSBkYXkud2VlaygpO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghd2Vla3NbaV0pIHtcclxuICAgICAgICAgICAgd2Vla3NbaV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2Vla3NbaV0ucHVzaChkYXkpO1xyXG4gICAgfSk7XHJcbiAgICBhbmd1bGFyLmZvckVhY2god2Vla3MsIGZ1bmN0aW9uICh3ZWVrKSB7XHJcbiAgICAgICAgdmFyIHdlZWtPYmogPSB7XHJcbiAgICAgICAgICAgIGlkOiB3ZWVrWzBdLndlZWsoKSxcclxuICAgICAgICAgICAgbGFiZWw6IHdlZWtbMF0uZm9ybWF0KFwiREQvTU1cIikgKyBcIiBhdSBcIiArIHdlZWtbd2Vlay5sZW5ndGggLSAxXS5mb3JtYXQoXCJERC9NTVwiKSxcclxuICAgICAgICAgICAgZGF5czogd2Vla1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzdWx0LnB1c2god2Vla09iaik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvbnZlcnRTdHJpbmdUb0RhdGUoc3RyRGF0ZSkge1xyXG4gICAgdmFyIHRhYkRhdGUgPSBzdHJEYXRlLnNwbGl0KFwiL1wiKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRhYkRhdGVbMV0gKyBcIi9cIiArIHRhYkRhdGVbMF0gKyBcIi9cIiArIHRhYkRhdGVbMl0pO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG52YXIgY29uc29tbWF0aW9uU2VydmljZSA9IGZ1bmN0aW9uIChhbGxvY2F0aW9uU2VydmljZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkQ29uc29tbWF0aW9uczogZnVuY3Rpb24gKHByb2plY3QsIHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikucXVlcnkoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbi8vIG5lZWQgdG8gbXVsdGlweSBieSAxMDAwIGZvciBnZXQgVU5JWCBUaW1lc3RhbXBcclxuICAgICAgICAgICAgICAgICAgICBtZW1iZXIuaW1wdXRhdGlvbnMgPSBtZW1iZXIucmVzb3VyY2UoXCJpbXB1dGF0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZ2V0KHtzdGFydDogc3RhcnQuZm9ybWF0KFwiWFwiKSAqIDEwMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBlbmQuZm9ybWF0KFwiWFwiKSAqIDEwMDB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyb3VwQnlXZWVrOiBmdW5jdGlvbiAoZW50cmllcywgZGF5cykge1xyXG4gICAgICAgICAgICB2YXIgZ3JvdXBlZCA9IHtcclxuICAgICAgICAgICAgICAgIHdlZWtzOiBncm91cFdlZWtzKGRheXMpLFxyXG4gICAgICAgICAgICAgICAgZW50cmllczogZW50cmllc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZW50cmllcywgZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS5pbXB1dGF0aW9ucy4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBlZEltcHV0YXRpb25zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGdyb3VwZWQud2Vla3MsIGZ1bmN0aW9uICh3ZWVrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aW1lU3BlbnQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2god2Vlay5kYXlzLCBmdW5jdGlvbiAoZGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3BlbnQgKz0gZW50cnkuaW1wdXRhdGlvbnMuaW1wdXRhdGlvbnNbZGF5LmZvcm1hdChcIkREL01NL1lZWVlcIildO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBlZEltcHV0YXRpb25zW3dlZWsuaWRdID0gdGltZVNwZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LmltcHV0YXRpb25zLmltcHV0YXRpb25zID0gZ3JvdXBlZEltcHV0YXRpb25zO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbnRyeS5pbXB1dGF0aW9ucy5kZXRhaWxzLCBmdW5jdGlvbiAoZGV0YWlsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncm91cGVkRGV0YWlsc0ltcHV0YXRpb24gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGdyb3VwZWQud2Vla3MsIGZ1bmN0aW9uICh3ZWVrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZVNwZW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh3ZWVrLmRheXMsIGZ1bmN0aW9uIChkYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3BlbnQgKz0gZGV0YWlsLmltcHV0YXRpb25zW2RheS5mb3JtYXQoXCJERC9NTS9ZWVlZXCIpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBlZERldGFpbHNJbXB1dGF0aW9uW3dlZWsuaWRdID0gdGltZVNwZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsLmltcHV0YXRpb25zID0gZ3JvdXBlZERldGFpbHNJbXB1dGF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JvdXBlZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNoZWNrTWlzc2luZ0J5RGF5OiBmdW5jdGlvbiAoZW50cmllcywgYXBwUGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgYWxsb2NhdGlvbnMgPSBhbGxvY2F0aW9uU2VydmljZS5sb2FkQWxsb2NhdGlvbihhcHBQYXJhbWV0ZXJzKTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVudHJpZXMsIGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkuaW1wdXRhdGlvbnMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyeS5pbXB1dGF0aW9ucy5pbXB1dGF0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkuaW1wdXRhdGlvbnMuaW1wdXRhdGlvbnNbaV0udmFsSW1wdXRhdGlvbiAhPT0gcGFyc2VJbnQoYWxsb2NhdGlvbnMubWF4KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRTdHJpbmdUb0RhdGUoZW50cnkuaW1wdXRhdGlvbnMuaW1wdXRhdGlvbnNbaV0uaW1wdXRhdGlvbkRhdGUpIDwgbmV3IERhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuaW1wdXRhdGlvbnMuaW1wdXRhdGlvbnNbaV0uYXJlTWlzc2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcbn07XHJcbmNvbnNvbW1hdGlvblNlcnZpY2UuJGluamVjdCA9IFtcImFsbG9jYXRpb25TZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbW1hdGlvblNlcnZpY2U7IiwidmFyIGdhbnR0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QsIGdhbnR0U2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmFkZFRhc2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvdGFzay9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFRhc2tDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRUYXNrQ3RybFwiLFxyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge30pO1xyXG4gICAgfTtcclxuICAgIHZtLmRhdGEgPSBnYW50dFNlcnZpY2UubG9hZFJvd3MocHJvamVjdCk7XHJcbn07XHJcbmdhbnR0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcImdhbnR0U2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBnYW50dENvbnRyb2xsZXI7XHJcbiIsInZhciBnYW50dENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9nYW50dC5jb250cm9sbGVyXCIpO1xyXG52YXIgZ2FudHRTZXJ2aWNlID0gcmVxdWlyZShcIi4vZ2FudHQuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZShcImthbmJhbi5wcm9qZWN0LmdhbnR0XCIsIFxyXG4gICAgW1wiZ2FudHRcIiwgJ2dhbnR0LnNvcnRhYmxlJywgJ2dhbnR0Lm1vdmFibGUnLCAnZ2FudHQub3ZlcmxhcCcsXHJcbiAgICAnZ2FudHQuZGVwZW5kZW5jaWVzJywgJ2dhbnR0LnRvb2x0aXBzJywgJ2dhbnR0LmJvdW5kcycsIFxyXG4gICAgJ2dhbnR0LnRhYmxlJywgJ2dhbnR0LnRyZWUnLCAnZ2FudHQuZ3JvdXBzJywgJ2dhbnR0LnJlc2l6ZVNlbnNvciddKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiZ2FudHRDb250cm9sbGVyXCIsIGdhbnR0Q29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcImdhbnR0U2VydmljZVwiLCBnYW50dFNlcnZpY2UpO1xyXG4iLCJ2YXIgZ2FudHRTZXJ2aWNlID0gZnVuY3Rpb24gKCRxKSB7XHJcblxyXG4gICAgdmFyIHJldHJpZXZlVGFza0J5U3dpbWxhbmUgPSBmdW5jdGlvbiAocHJvamVjdCwgc3dpbWxhbmUpIHtcclxuICAgICAgICBzd2ltbGFuZS50YXNrcyA9IFtdO1xyXG4gICAgICAgIHZhciBnYW50dFRhc2tzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoe3N3aW1sYW5lOiBzd2ltbGFuZS5pZH0pO1xyXG4gICAgICAgIGdhbnR0VGFza3MuJHByb21pc2UudGhlbihmdW5jdGlvbiAodGFza3MpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICAgICAgc3dpbWxhbmUudGFza3MucHVzaChmZXRjaFRvR2FudHRUYXNrKHRhc2spKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdmFyIHJldHJpZXZlVGFza05vU3dpbWxhbmUgPSBmdW5jdGlvbiAocHJvamVjdCkge1xyXG4gICAgICAgIHZhciBiYWNrbG9nID0ge25hbWU6IFwiYmFja2xvZ1wiLCB0YXNrczogW119O1xyXG4gICAgICAgIHZhciBnYW50dFRhc2tzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoe25vc3dpbWxhbmU6IHRydWV9KTtcclxuICAgICAgICBnYW50dFRhc2tzLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHRhc2tzKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0YXNrcywgZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgIGJhY2tsb2cudGFza3MucHVzaChmZXRjaFRvR2FudHRUYXNrKHRhc2spKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGJhY2tsb2c7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgZmV0Y2hUb0dhbnR0VGFzayA9IGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgdmFyIHN0YXJ0RGF0ZSA9IG1vbWVudCgpO1xyXG4gICAgICAgIHZhciBlbmREYXRlID0gbW9tZW50KCk7XHJcbiAgICAgICAgaWYgKHRhc2sucGxhbm5lZFN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGF0ZSA9IHRhc2sucGxhbm5lZFN0YXJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFzay5wbGFubmVkRW5kaW5nKSB7XHJcbiAgICAgICAgICAgIGVuZERhdGUgPSB0YXNrLnBsYW5uZWRFbmRpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiB0YXNrLmlkLFxyXG4gICAgICAgICAgICBuYW1lOiB0YXNrLm5hbWUsXHJcbiAgICAgICAgICAgIGZyb206IHN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgdG86IGVuZERhdGUsXHJcbiAgICAgICAgICAgIGNvbG9yOiBcIiMwMjg4ZDFcIlxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2FkUm93czogZnVuY3Rpb24gKHByb2plY3QpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuICAgICAgICAgICAgZGF0YS5wdXNoKHJldHJpZXZlVGFza05vU3dpbWxhbmUocHJvamVjdCkpO1xyXG4gICAgICAgICAgICB2YXIgc3dpbWxhbmVzUmVzb3VyY2UgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICAgICAgc3dpbWxhbmVzUmVzb3VyY2UuJHByb21pc2UudGhlbihmdW5jdGlvbiAoc3dpbWxhbmVzKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goc3dpbWxhbmVzLCBmdW5jdGlvbiAoc3dpbWxhbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goc3dpbWxhbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHJpZXZlVGFza0J5U3dpbWxhbmUocHJvamVjdCwgc3dpbWxhbmUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuZ2FudHRTZXJ2aWNlLiRpbmplY3QgPSBbXCIkcVwiXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2FudHRTZXJ2aWNlO1xyXG4iLCJ2YXIga2FuYmFuQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QsIGthbmJhblNlcnZpY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICBcclxuICAgIHZhciBsb2FkS2FuYmFuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZtLnN0YXRlcyA9IHByb2plY3QucmVzb3VyY2UoXCJzdGF0ZVwiKS5xdWVyeSh7XCJrYW5iYW5cIjogdHJ1ZX0pO1xyXG4gICAgICAgIHZtLnN3aW1sYW5lcyA9IGthbmJhblNlcnZpY2UubG9hZChwcm9qZWN0KTtcclxuICAgICAgICB2bS5zd2ltbGFuZXNUb0ZpbHRyZSA9IHZtLnN3aW1sYW5lcztcclxuICAgIH07XHJcbiAgICBwcm9qZWN0LiRwcm9taXNlLnRoZW4obG9hZEthbmJhbik7XHJcbiAgICB2bS5hZGRUYXNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRUYXNrQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkVGFza0N0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGxvYWRLYW5iYW4pO1xyXG4gICAgfTtcclxuICAgIHZtLmthbmJhblNvcnRPcHRpb25zID0ge1xyXG4gICAgICAgIGl0ZW1Nb3ZlZDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrID0gZXZlbnQuc291cmNlLml0ZW1TY29wZS5tb2RlbFZhbHVlO1xyXG4gICAgICAgICAgICB0YXNrLnN0YXRlLmlkID0gZXZlbnQuZGVzdC5zb3J0YWJsZVNjb3BlLmVsZW1lbnQuYXR0cihcImRhdGEtY29sdW1uaW5kZXhcIik7XHJcbiAgICAgICAgICAgIHZhciBzd2ltbGFuZUlkID0gZXZlbnQuZGVzdC5zb3J0YWJsZVNjb3BlLmVsZW1lbnQuYXR0cihcImRhdGEtcm93aW5kZXhcIik7XHJcbiAgICAgICAgICAgIGlmIChzd2ltbGFuZUlkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRhc2suc3dpbWxhbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrLnN3aW1sYW5lID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXNrLnN3aW1sYW5lLmlkID0gZXZlbnQuZGVzdC5zb3J0YWJsZVNjb3BlLmVsZW1lbnQuYXR0cihcImRhdGEtcm93aW5kZXhcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrLnN3aW1sYW5lID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXNrLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKG51bGwsIHRhc2ssIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZtLnN0YXRlcyA9IHByb2plY3QucmVzb3VyY2UoXCJzdGF0ZVwiKS5xdWVyeSh7XCJvcmRlclwiOiBcInBvc2l0aW9uXCJ9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdm0ucmVzZXRGaWx0ZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZtLmZpbHRlci5jdXJyZW50dXNlciA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmZpbHRlci51cmdlbnQ9IGZhbHNlO1xyXG4gICAgfTtcclxufTtcclxua2FuYmFuQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcImthbmJhblNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0ga2FuYmFuQ29udHJvbGxlcjtcclxuIiwidmFyIGthbmJhbkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9rYW5iYW4uY29udHJvbGxlclwiKTtcclxudmFyIGthbmJhblNlcnZpY2UgPSByZXF1aXJlKFwiLi9rYW5iYW4uc2VydmljZVwiKTtcclxudmFyIGN1cnJlbnR1c2VyS2FuYmFuRmlsdGVyID0gcmVxdWlyZShcIi4vdXNlci5maWx0ZXJcIik7XHJcbnZhciB1cmdlbnRLYW5iYW5GaWx0ZXIgPSByZXF1aXJlKFwiLi91cmdlbnQuZmlsdGVyXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4ucHJvamVjdC5rYW5iYW4nLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImthbmJhbkNvbnRyb2xsZXJcIiwga2FuYmFuQ29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcImthbmJhblNlcnZpY2VcIiwga2FuYmFuU2VydmljZSlcclxuICAgICAgICAuZmlsdGVyKFwiY3VycmVudHVzZXJLYW5iYW5GaWx0ZXJcIiwgY3VycmVudHVzZXJLYW5iYW5GaWx0ZXIpXHJcbiAgICAgICAgLmZpbHRlcihcInVyZ2VudEthbmJhbkZpbHRlclwiLCB1cmdlbnRLYW5iYW5GaWx0ZXIpOyIsInZhciBrYW5iYW5TZXJ2aWNlID0gZnVuY3Rpb24gKCRxLCB0YXNrQXNzZW1ibGVyU2VydmljZSkge1xyXG5cclxuICAgIHZhciBmZXRjaEthbmJhblRhc2sgPSBmdW5jdGlvbiAodGFza3MpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2godGFza3MsIGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgICAgIHRhc2sgPSB0YXNrQXNzZW1ibGVyU2VydmljZSh0YXNrKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGFza3M7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZXRyaWV2ZVRhc2tCeVN3aW1sYW5lID0gZnVuY3Rpb24gKHByb2plY3QsIHN0YXRlcywgc3dpbWxhbmVJZCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHtpZDogc3RhdGUuaWR9O1xyXG4gICAgICAgICAgICByZXN1bHRbaV0udGFza3MgPSBwcm9qZWN0LnJlc291cmNlKFwidGFza1wiKS5xdWVyeShcclxuICAgICAgICAgICAgICAgICAgICB7XCJzd2ltbGFuZVwiOiBzd2ltbGFuZUlkLCBcInN0YXRlXCI6IHN0YXRlLmlkfSxcclxuICAgICAgICAgICAgICAgICAgICBmZXRjaEthbmJhblRhc2spO1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHJldHJpZXZlVGFza05vU3dpbWxhbmUgPSBmdW5jdGlvbiAocHJvamVjdCwgc3RhdGVzKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgcmVzdWx0W2ldID0ge2lkOiBzdGF0ZS5pZH07XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXS50YXNrcyA9IHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KFxyXG4gICAgICAgICAgICAgICAgICAgIHtcIm5vc3dpbWxhbmVcIjogdHJ1ZSwgXCJzdGF0ZVwiOiBzdGF0ZS5pZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hLYW5iYW5UYXNrKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZDogZnVuY3Rpb24gKHByb2plY3QpIHtcclxuICAgICAgICAgICAgdmFyIHRhc2tzID0gW107XHJcbiAgICAgICAgICAgIHByb2plY3QuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGVzUmVzb3VyY2UgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoe1wia2FuYmFuXCI6IHRydWV9KTtcclxuICAgICAgICAgICAgICAgIHZhciBzd2ltbGFuZXNSZXNvdXJjZSA9IHByb2plY3QucmVzb3VyY2UoXCJzd2ltbGFuZVwiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICAgICAgJHEuYWxsKFtzdGF0ZXNSZXNvdXJjZS4kcHJvbWlzZSwgc3dpbWxhbmVzUmVzb3VyY2UuJHByb21pc2VdKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXRlcyA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN3aW1sYW5lcyA9IGRhdGFbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN3aW1sYW5lcywgZnVuY3Rpb24gKHN3aW1sYW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goc3dpbWxhbmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2ltbGFuZS5zdGF0ZXMgPSByZXRyaWV2ZVRhc2tCeVN3aW1sYW5lKHByb2plY3QsIHN0YXRlcywgc3dpbWxhbmUuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub3N3aW1sYW5lID0ge3N0YXRlczogc3RhdGVzID0gcmV0cmlldmVUYXNrTm9Td2ltbGFuZShwcm9qZWN0LCBzdGF0ZXMpfTtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKG5vc3dpbWxhbmUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGFza3M7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxua2FuYmFuU2VydmljZS4kaW5qZWN0ID0gW1wiJHFcIiwgXCJ0YXNrQXNzZW1ibGVyU2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBrYW5iYW5TZXJ2aWNlO1xyXG4iLCJmdW5jdGlvbiB1cmdlbnRLYW5iYW5GaWx0ZXIoKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBhY3RpdmF0ZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbnB1dFtpXS51cmdlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChpbnB1dFtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfVxyXG4gICAgO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gdXJnZW50S2FuYmFuRmlsdGVyO1xyXG5cclxuIiwiZnVuY3Rpb24gY3VycmVudHVzZXJLYW5iYW5GaWx0ZXIoY3VycmVudFVzZXJTZXJ2aWNlKSB7XHJcbiAgICB2YXIgY3VycmVudHVzZXIgPSBjdXJyZW50VXNlclNlcnZpY2UuZ2V0KCk7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBhY3RpdmF0ZSkge1xyXG4gICAgICAgIGlmIChhY3RpdmF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5wdXRbaV0uYXNzaWduZWVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlucHV0W2ldLmFzc2lnbmVlc1tqXS51c2VySWQgPT09IGN1cnJlbnR1c2VyLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGlucHV0W2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlucHV0O1xyXG4gICAgfTtcclxufVxyXG5cclxuY3VycmVudHVzZXJLYW5iYW5GaWx0ZXIuJGluamVjdD1bXCJjdXJyZW50VXNlclNlcnZpY2VcIl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cz1jdXJyZW50dXNlckthbmJhbkZpbHRlcjtcclxuXHJcbiIsInZhciByZXNvbHZlUHJvamVjdCA9IGZ1bmN0aW9uICgkc3RhdGVQYXJhbXMsIHByb2plY3RTZXJ2aWNlKSB7XHJcbiAgICByZXR1cm4gcHJvamVjdFNlcnZpY2UuZ2V0KHtcInByb2plY3RJZFwiOiAkc3RhdGVQYXJhbXMucHJvamVjdElkfSk7XHJcbn07XHJcbnJlc29sdmVQcm9qZWN0LiRpbmplY3QgPSBbXCIkc3RhdGVQYXJhbXNcIiwgXCJwcm9qZWN0U2VydmljZVwiXTtcclxuXHJcbnZhciByZXNvbHZlVXNlclJpZ2h0cyA9IGZ1bmN0aW9uICgkcSwgJHN0YXRlUGFyYW1zLCBjdXJyZW50dXNlcikge1xyXG4gICAgdmFyIGRlZmVyID0gJHEuZGVmZXIoKTtcclxuICAgIGN1cnJlbnR1c2VyLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc0FkbWluID0gKGN1cnJlbnR1c2VyLmFwcGxpY2F0aW9uUm9sZSA9PT0gXCJBRE1JTlwiKTtcclxuICAgICAgICBjdXJyZW50dXNlci5yZXNvdXJjZShcIm1lbWJlclwiKS5nZXQoe1wicHJvamVjdElkXCI6ICRzdGF0ZVBhcmFtcy5wcm9qZWN0SWR9LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvamVjdFJvbGUgPSBkYXRhLnByb2plY3RSb2xlO1xyXG4gICAgICAgICAgICB2YXIgcmlnaHRzID0ge1xyXG4gICAgICAgICAgICAgICAgaGFzQWRtaW5SaWdodHM6IChpc0FkbWluIHx8IHByb2plY3RSb2xlID09PSBcIk1BTkFHRVJcIiksXHJcbiAgICAgICAgICAgICAgICBoYXNFZGl0UmlnaHRzOiAoaXNBZG1pbiB8fCBwcm9qZWN0Um9sZSA9PT0gXCJNQU5BR0VSXCIgfHwgcHJvamVjdFJvbGUgPT09IFwiQ09OVFJJQlVUT1JcIiksXHJcbiAgICAgICAgICAgICAgICBoYXNSZWFkUmlnaHRzOiAoaXNBZG1pbiB8fCBwcm9qZWN0Um9sZSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZGVmZXIucmVzb2x2ZShyaWdodHMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcclxufTtcclxucmVzb2x2ZVVzZXJSaWdodHMuJGluamVjdCA9IFtcIiRxXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiY3VycmVudHVzZXJcIl07XHJcblxyXG52YXIgY29uZmlnID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0XCIsIHtcclxuICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICBjb250cm9sbGVyOiBcInByb2plY3RDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcInByb2plY3RDdHJsXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvbGF5b3V0LXNpbmdsZS5odG1sXCIsXHJcbiAgICAgICAgdXJsOiBcInByb2plY3QvOnByb2plY3RJZC9cIixcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIHByb2plY3Q6IHJlc29sdmVQcm9qZWN0LFxyXG4gICAgICAgICAgICB1c2VyUmlnaHRzOiByZXNvbHZlVXNlclJpZ2h0c1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC5rYW5iYW5cIiwge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L2thbmJhbi9rYW5iYW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwia2FuYmFuQ29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJrYW5iYW5DdHJsXCIsXHJcbiAgICAgICAgdXJsOiBcImthbmJhblwiXHJcbiAgICB9KTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZ2FudHRcIiwge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L2dhbnR0L2dhbnR0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImdhbnR0Q29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJnYW50dEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiZ2FudHRcIlxyXG4gICAgfSk7XHJcbn07XHJcbmNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG5cclxuIiwiICAgICAgICB2YXIgcHJvamVjdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHN0YXRlLCBwcm9qZWN0LCB1c2VyUmlnaHRzKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZtLnByb2plY3QgPSBwcm9qZWN0O1xyXG4gICAgICAgICAgICBpZiAoIXVzZXJSaWdodHMuaGFzUmVhZFJpZ2h0cykge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImFwcC5kYXNoYm9hcmRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdm0ucmlnaHRzID0gdXNlclJpZ2h0cztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByb2plY3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc3RhdGVcIiwgXCJwcm9qZWN0XCIsIFwidXNlclJpZ2h0c1wiXTtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHByb2plY3RDb250cm9sbGVyOyIsInZhciBrYW5iYW5Nb2R1bGUgPSByZXF1aXJlKFwiLi9rYW5iYW4va2FuYmFuLm1vZHVsZVwiKTtcclxudmFyIHRhc2tNb2R1bGUgPSByZXF1aXJlKFwiLi90YXNrL3Rhc2subW9kdWxlXCIpO1xyXG52YXIgY29uc29tbWF0aW9uTW9kdWxlID0gcmVxdWlyZShcIi4vY29uc29tbWF0aW9uL2NvbnNvbW1hdGlvbi5tb2R1bGVcIik7XHJcbnZhciBnYW50dE1vZHVsZSA9IHJlcXVpcmUoXCIuL2dhbnR0L2dhbnR0Lm1vZHVsZVwiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL3Byb2plY3QuY29uZmlnXCIpO1xyXG52YXIgcHJvamVjdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9wcm9qZWN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBwcm9qZWN0U2VydmljZSA9IHJlcXVpcmUoXCIuL3Byb2plY3Quc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QnLFxyXG4gICAgICAgIFtrYW5iYW5Nb2R1bGUubmFtZSwgdGFza01vZHVsZS5uYW1lLCBjb25zb21tYXRpb25Nb2R1bGUubmFtZSxcclxuICAgICAgICAgICAgZ2FudHRNb2R1bGUubmFtZV0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJwcm9qZWN0Q29udHJvbGxlclwiLCBwcm9qZWN0Q29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcInByb2plY3RTZXJ2aWNlXCIsIHByb2plY3RTZXJ2aWNlKTsiLCJ2YXIgcHJvamVjdFNlcnZpY2UgPSBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4gJHJlc291cmNlKFwiL2FwaS9wcm9qZWN0Lzpwcm9qZWN0SWRcIik7XHJcbn07XHJcbnByb2plY3RTZXJ2aWNlLiRpbmplY3QgPSBbXCIkcmVzb3VyY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gcHJvamVjdFNlcnZpY2U7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5jYXRlZ29yaWVzID0gcHJvamVjdC5yZXNvdXJjZShcImNhdGVnb3J5XCIpLnF1ZXJ5KCk7XHJcbiAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwidGFza1wiKS5zYXZlKHZtLnRhc2ssIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHRhc2ssIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5nZXRNZW1iZXJzID0gZnVuY3Rpb24gKHRlcm0pIHtcclxuICAgICAgICByZXR1cm4gcHJvamVjdC5yZXNvdXJjZShcIm1lbWJlclwiKS5xdWVyeSh7c2VhcmNoOiB0ZXJtfSkuJHByb21pc2U7XHJcbiAgICB9O1xyXG4gICAgdm0uc2VsZWN0TWVtYmVyID0gZnVuY3Rpb24gKCRpdGVtLCAkbW9kZWwsICRsYWJlbCkge1xyXG4gICAgICAgIHZtLmFsbG9jYXRpb24ubWVtYmVyID0gJG1vZGVsO1xyXG4gICAgfTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0YXNrLnJlc291cmNlKFwiYWxsb2NhdGlvblwiKS5zYXZlKHZtLmFsbG9jYXRpb24sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJ0YXNrXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyOyIsInZhciBsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxudmFyIGFkZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hZGQuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QudGFzay5hbGxvY2F0aW9uJywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhbGxvY2F0aW9uTGlzdENvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhbGxvY2F0aW9uQWRkQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKSIsInZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIGN1cnJlbnR0YXNrLCBjdXJyZW50cHJvamVjdCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL2FsbG9jYXRpb24vYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhbGxvY2F0aW9uQWRkQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkQWxsb2NhdGlvbkN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgdGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50dGFzaztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRwcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcInhkXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0uYWxsb2NhdGlvbnMgPSBjdXJyZW50dGFzay5yZXNvdXJjZShcImFsbG9jYXRpb25cIikucXVlcnkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAoYWxsb2NhdGlvbikge1xyXG4gICAgICAgIGFsbG9jYXRpb24ucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLmFsbG9jYXRpb25zID0gY3VycmVudHRhc2sucmVzb3VyY2UoXCJhbGxvY2F0aW9uXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uYWxsb2NhdGlvbnMgPSBjdXJyZW50dGFzay5hbGxvY2F0aW9ucyA9IGN1cnJlbnR0YXNrLnJlc291cmNlKFwiYWxsb2NhdGlvblwiKS5xdWVyeSgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwidGFza1wiLCBcInByb2plY3RcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gbGlzdENvbnRyb2xsZXI7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHRhc2ssIGNvbW1lbnQpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICBpZiAoY29tbWVudC5pZCkge1xyXG4gICAgICAgIHZtLnBhcmVudENvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgfVxyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh2bS5wYXJlbnRDb21tZW50KSB7XHJcbiAgICAgICAgICAgIHZtLnBhcmVudENvbW1lbnQucmVzb3VyY2UoXCJyZXBseVwiKS5zYXZlKHZtLmNvbW1lbnQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0YXNrLnJlc291cmNlKFwiY29tbWVudFwiKS5zYXZlKHZtLmNvbW1lbnQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5hZGRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiLCBcInRhc2tcIiwgXCJjb21tZW50XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7XHJcblxyXG4iLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbnZhciByZXBseUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9yZXBseS5jb250cm9sbGVyXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4ucHJvamVjdC50YXNrLmNvbW1lbnQnLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImNvbW1lbnRMaXN0Q29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcImNvbW1lbnRBZGRDb250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJjb21tZW50UmVwbHlDb250cm9sbGVyXCIsIHJlcGx5Q29udHJvbGxlcik7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgc2NvcGUpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2YXIgY3VycmVudHRhc2sgPSBzY29wZS50YXNrQ3RybC50YXNrO1xyXG4gICAgdm0uYWRkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svY29tbWVudC9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImNvbW1lbnRBZGRDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRDb21tZW50Q3RybFwiLFxyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICB0YXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnR0YXNrO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5jb21tZW50cyA9IGN1cnJlbnR0YXNrLnJlc291cmNlKFwiY29tbWVudFwiKS5xdWVyeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlcGx5ID0gZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL2NvbW1lbnQvYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJjb21tZW50QWRkQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkQ29tbWVudEN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgY29tbWVudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb21tZW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudHRhc2s7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb21tZW50LnNob3dDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdm0uc2VsZWN0ZWRDb21tZW50ID0gY29tbWVudC5yZXNvdXJjZShcInJlcGx5XCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uc2hvd0hpZGVSZXBseSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgaWYgKGNvbW1lbnQuc2hvd0NvbW1lbnQpIHtcclxuICAgICAgICAgICAgY29tbWVudC5zaG93Q29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkQ29tbWVudCA9IGNvbW1lbnQucmVzb3VyY2UoXCJyZXBseVwiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICBjb21tZW50LnNob3dDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHBhcmVudENvbW1lbnQsIGNvbW1lbnQpIHtcclxuICAgICAgICBjb21tZW50LnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50Q29tbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdm0uc2VsZWN0ZWRDb21tZW50ID0gcGFyZW50Q29tbWVudC5yZXNvdXJjZShcInJlcGx5XCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jb21tZW50cyA9IGN1cnJlbnR0YXNrLnJlc291cmNlKFwiY29tbWVudFwiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLnNlbGVjdGVkQ29tbWVudCA9PT0gY29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQ29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBjdXJyZW50dGFzay4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5jb21tZW50cyA9IGN1cnJlbnR0YXNrLnJlc291cmNlKFwiY29tbWVudFwiKS5xdWVyeSgpO1xyXG4gICAgfSk7XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkc2NvcGVcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gbGlzdENvbnRyb2xsZXI7IiwiICAgICAgICB2YXIgbGlzdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoc2NvcGUpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKFwiY29tbWVudExpc3RDdHJsLnNlbGVjdGVkQ29tbWVudFwiLCBmdW5jdGlvbiAobmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50Y29tbWVudCA9IG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRjb21tZW50LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5yZXBsaWVzID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIl07XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjtcclxuIiwidmFyIGhpc3RvQ29udHJvbGxlciA9IGZ1bmN0aW9uIChzY29wZSxoaXN0b1NlcnZpY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5wYWdlID0gMTtcclxuICAgIHZtLnNpemUgPSAxMDtcclxuICAgIHZtLmNwdCA9IDA7XHJcbiAgICB2bS5idXN5ID0gZmFsc2U7XHJcbiAgICB2bS5oaXN0b3NUYXNrID0gW107XHJcbiAgICB2bS5ub01vcmVIaXN0byA9IGZhbHNlO1xyXG5cclxuICAgIHZtLmxvYWRIaXN0byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZighdm0ubm9Nb3JlSGlzdG8peyAvLyBXZSBjaGVjayB0aGF0IHRoZSBsYXN0IGNhbGwgZGlkIG5vdCByZXR1cm4gbm8gcmVzdWx0XHJcbiAgICAgICAgICAgIGlmKCF2bS5idXN5KXsgLy8gV2UgY2hlY2sgdGhhdCBpdCBkb2VzIG5vdCBhbm90aGVyIGNhbGxpbmcgdG8gc2VydmVyXHJcbiAgICAgICAgICAgICAgICB2bS5idXN5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50dGFzayA9IHNjb3BlLnRhc2tDdHJsLnRhc2s7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50dGFzay4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50dGFzay5yZXNvdXJjZShcImhpc3RvXCIpLnF1ZXJ5KHtwYWdlOiB2bS5wYWdlLCBzaXplOiB2bS5zaXplfSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaGlzdG9zVGFzay5wdXNoKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uIChoaXN0b1Rhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5oaXN0b3NUYXNrW3ZtLmNwdF0gPSBoaXN0b1NlcnZpY2UoaGlzdG9UYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5jcHQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYnVzeSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBpZiB0aGUgbGFzdCByZXR1cm4gaGFzIG5vIHJlc3VsdCwgbm9Nb3JlSGlzdG8gYmVjb21lcyB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5ub01vcmVIaXN0byA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5wYWdlID0gdm0ucGFnZSArIDEwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnNpemUgPSB2bS5zaXplICsgMTA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdm0ubG9hZEhpc3RvKCk7XHJcbn07XHJcbmhpc3RvQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiaGlzdG9TZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGhpc3RvQ29udHJvbGxlcjsiLCJ2YXIgaGlzdG9Db250cm9sbGVyID0gcmVxdWlyZShcIi4vaGlzdG9yeS5jb250cm9sbGVyXCIpO1xyXG52YXIgaGlzdG9TZXJ2aWNlID0gcmVxdWlyZShcIi4vaGlzdG9yeS5zZXJ2aWNlXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4ucHJvamVjdC50YXNrLmhpc3RvcnknLCBbXSlcclxuICAgIC5jb250cm9sbGVyKFwiaGlzdG9Db250cm9sbGVyXCIsIGhpc3RvQ29udHJvbGxlcilcclxuICAgIC5zZXJ2aWNlKFwiaGlzdG9TZXJ2aWNlXCIsIGhpc3RvU2VydmljZSk7IiwidmFyIGhpc3RvU2VydmljZSA9IGZ1bmN0aW9uICgkaHR0cCwgSGF0ZW9hc0ludGVyZmFjZSwgbW9tZW50KSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGhpc3RvVGFzaykge1xyXG4gICAgICAgIGlmKGhpc3RvVGFzay5fbGlua3MucHJvamVjdCl7XHJcbiAgICAgICAgICAgIGhpc3RvVGFzay5wcm9qZWN0TmFtZUNoZWNrZWQgPSBmYWxzZSA7XHJcbiAgICAgICAgICAgICRodHRwLmdldChoaXN0b1Rhc2suX2xpbmtzLnByb2plY3QpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGlzdG9UYXNrLnByb2plY3ROYW1lID09PSBkYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaXN0b1Rhc2sucHJvamVjdE5hbWVDaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGhpc3RvVGFzay5fbGlua3Muc3RhdGUpe1xyXG4gICAgICAgICAgICBoaXN0b1Rhc2suc3RhdGVOYW1lQ2hlY2tlZCA9IGZhbHNlIDtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGhpc3RvVGFzay5fbGlua3Muc3RhdGUpLnRoZW4oZnVuY3Rpb24oc3RhdGUpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpc3RvVGFzay5zdGF0ZU5hbWUgPT09IHN0YXRlLmRhdGEubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpc3RvVGFzay5zdGF0ZU5hbWVDaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGhpc3RvVGFzay5fbGlua3MuYXNzaWduZWUpe1xyXG4gICAgICAgICAgICBoaXN0b1Rhc2suYXNzaWduZWVOYW1lQ2hlY2tlZCA9IGZhbHNlIDtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGhpc3RvVGFzay5fbGlua3MuYXNzaWduZWUpLnRoZW4oZnVuY3Rpb24oYXNzaWduZWUpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpc3RvVGFzay5hc3NpZ25lZU5hbWUgPT09IGFzc2lnbmVlLmRhdGEubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpc3RvVGFzay5hc3NpZ25lZU5hbWVDaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGhpc3RvVGFzay5fbGlua3MuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgaGlzdG9UYXNrLmNhdGVnb3J5TmFtZUNoZWNrZWQgPSBmYWxzZSA7XHJcbiAgICAgICAgICAgICRodHRwLmdldChoaXN0b1Rhc2suX2xpbmtzLmNhdGVnb3J5KS50aGVuKGZ1bmN0aW9uKGNhdGVnb3J5KXtcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b1Rhc2suY2F0ZWdvcnlOYW1lID09PSBjYXRlZ29yeS5kYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaXN0b1Rhc2suY2F0ZWdvcnlOYW1lQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoaXN0b1Rhc2suX2xpbmtzLnN3aW1sYW5lKXtcclxuICAgICAgICAgICAgaGlzdG9UYXNrLnN3aW1sYW5lTmFtZUNoZWNrZWQgPSBmYWxzZSA7XHJcbiAgICAgICAgICAgICRodHRwLmdldChoaXN0b1Rhc2suX2xpbmtzLnN3aW1sYW5lKS50aGVuKGZ1bmN0aW9uKHN3aW1sYW5lKXtcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b1Rhc2suc3dpbWxhbmVOYW1lID09PSBzd2ltbGFuZS5kYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaXN0b1Rhc2suc3dpbWxhbmVOYW1lQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGlzdG9UYXNrO1xyXG4gICAgfTtcclxufVxyXG5cclxuaGlzdG9TZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIiwgXCJtb21lbnRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gaGlzdG9TZXJ2aWNlO1xyXG4iLCJ2YXIgdGFza0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBwcm9qZWN0LCB0YXNrQXNzZW1ibGVyU2VydmljZSwgSGF0ZW9hc0ludGVyZmFjZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmZpbHRlciA9IHtzdGF0ZTogXCJhbGxcIiwgc3dpbWxhbmU6IFwiYWxsXCIsIGNhdGVnb3J5OiBcImFsbFwiLCBtZW1iZXI6IFwiYWxsXCJ9O1xyXG4gICAgdm0ubG9hZFBhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikuZ2V0KFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U6IHZtLnRhc2tzLnBhZ2UubnVtYmVyIC0gMSxcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiB2bS50YXNrcy5wYWdlLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydDogdm0uc29ydC5maWVsZCxcclxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyZWN0aW9uOiB2bS5zb3J0LnNvcnREaXJlY3Rpb25cclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLl9lbWJlZGRlZCkge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGRhdGEuX2VtYmVkZGVkLnRhc2tSZXNvdXJjZUxpc3QsIHRhc2tBc3NlbWJsZXJTZXJ2aWNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhLnBhZ2UubnVtYmVyKys7XHJcbiAgICAgICAgICAgIHZtLnRhc2tzID0gZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2bS5zdGF0ZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5tZW1iZXJzID0gcHJvamVjdC5yZXNvdXJjZShcIm1lbWJlclwiKS5xdWVyeSgpO1xyXG4gICAgICAgIHZtLmNhdGVnb3JpZXMgPSBwcm9qZWN0LnJlc291cmNlKFwiY2F0ZWdvcnlcIikucXVlcnkoKTtcclxuICAgIH07XHJcbiAgICB2bS50YXNrcyA9IHtcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIHNpemU6IDEwLFxyXG4gICAgICAgICAgICBudW1iZXI6IDFcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdm0uc29ydCA9IHtcclxuICAgICAgICBmaWVsZDogXCJuYW1lXCIsXHJcbiAgICAgICAgc29ydERpcmVjdGlvbjogXCJkZXNjXCJcclxuICAgIH07XHJcbiAgICB2bS5sb2FkUGFnZSgpO1xyXG4gICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICBuZXcgSGF0ZW9hc0ludGVyZmFjZSh0YXNrKS5yZXNvdXJjZShcInNlbGZcIikuZGVsZXRlKHZtLmxvYWRQYWdlKTtcclxuICAgIH07XHJcbiAgICB2bS5hZGRUYXNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRUYXNrQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkVGFza0N0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKHZtLmxvYWRQYWdlKTtcclxuICAgIH07XHJcbiAgICB2bS50YWJsZUZpbHRlciA9IGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcclxuICAgICAgICBpZiAodm0uc29ydC5maWVsZCAhPT0gcHJlZGljYXRlKSB7XHJcbiAgICAgICAgICAgIHZtLnNvcnQuc29ydERpcmVjdGlvbiA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZtLnNvcnQuc29ydERpcmVjdGlvbiA9IHZtLnNvcnQuc29ydERpcmVjdGlvbiA9PT0gXCJkZXNjXCIgPyBcImFzY1wiIDogXCJkZXNjXCI7XHJcbiAgICAgICAgdm0uc29ydC5maWVsZCA9IHByZWRpY2F0ZTtcclxuICAgICAgICB2bS5sb2FkUGFnZSgpO1xyXG4gICAgfTtcclxuICAgIHZtLmNoYW5nZWRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBmaWx0ZXIgPSB7fTtcclxuICAgICAgICBpZiAodm0uZmlsdGVyLnN0YXRlICE9PSBcImFsbFwiKSB7XHJcbiAgICAgICAgICAgIGZpbHRlci5pZFN0YXRlID0gdm0uZmlsdGVyLnN0YXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZtLmZpbHRlci5zd2ltbGFuZSAhPT0gXCJhbGxcIikge1xyXG4gICAgICAgICAgICBmaWx0ZXIuaWRTd2ltbGFuZSA9IHZtLmZpbHRlci5zd2ltbGFuZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2bS5maWx0ZXIubWVtYmVyICE9PSBcImFsbFwiKSB7XHJcbiAgICAgICAgICAgIGZpbHRlci5pZEFzc2lnbmVlID0gdm0uZmlsdGVyLm1lbWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2bS5maWx0ZXIuY2F0ZWdvcnkgIT09ICdhbGwnKSB7XHJcbiAgICAgICAgICAgIGZpbHRlci5pZENhdGVnb3J5ID0gdm0uZmlsdGVyLmNhdGVnb3J5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZih2bS5maWx0ZXIuZGVsZXRlZCl7XHJcbiAgICAgICAgICAgIGZpbHRlci5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikuZ2V0KHtpZFN0YXRlOiBmaWx0ZXIuaWRTdGF0ZSwgaWRTd2ltbGFuZSA6IGZpbHRlci5pZFN3aW1sYW5lLCBpZEFzc2lnbmVlIDogZmlsdGVyLmlkQXNzaWduZWUsXHJcbiAgICAgICAgICAgIGlkQ2F0ZWdvcnkgOiBmaWx0ZXIuaWRDYXRlZ29yeSwgZGVsZXRlZCA6IGZpbHRlci5kZWxldGVkLCBwYWdlOiB2bS50YXNrcy5wYWdlLm51bWJlciAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogdm0udGFza3MucGFnZS5zaXplLCBzb3J0OiB2bS5zb3J0LmZpZWxkLCBzb3J0RGlyZWN0aW9uOiB2bS5zb3J0LnNvcnREaXJlY3Rpb259LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5fZW1iZWRkZWQpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLl9lbWJlZGRlZC50YXNrUmVzb3VyY2VMaXN0LCB0YXNrQXNzZW1ibGVyU2VydmljZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS5wYWdlLm51bWJlcisrO1xyXG4gICAgICAgICAgICB2bS50YXNrcyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVzZXRGaWx0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0uZmlsdGVyLnN0YXRlID0gXCJhbGxcIjtcclxuICAgICAgICB2bS5maWx0ZXIuc3dpbWxhbmUgPSBcImFsbFwiO1xyXG4gICAgICAgIHZtLmZpbHRlci5jYXRlZ29yeSA9IFwiYWxsXCI7XHJcbiAgICAgICAgdm0uZmlsdGVyLm1lbWJlciA9IFwiYWxsXCI7XHJcbiAgICAgICAgdm0uY2hhbmdlZEZpbHRlcigpO1xyXG4gICAgfTtcclxufTtcclxudGFza0NvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInByb2plY3RcIiwgXCJ0YXNrQXNzZW1ibGVyU2VydmljZVwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdGFza0NvbnRyb2xsZXI7IiwidmFyIHJlc29sdmVUYXNrID0gZnVuY3Rpb24gKCRzdGF0ZVBhcmFtcywgdGFza1NlcnZpY2UpIHtcclxuICAgIHJldHVybiB0YXNrU2VydmljZS5nZXQoe1wicHJvamVjdElkXCI6ICRzdGF0ZVBhcmFtcy5wcm9qZWN0SWQsIFwidGFza0lkXCI6ICRzdGF0ZVBhcmFtcy50YXNrSWR9KTtcclxufTtcclxucmVzb2x2ZVRhc2suJGluamVjdCA9IFtcIiRzdGF0ZVBhcmFtc1wiLCBcInRhc2tTZXJ2aWNlXCJdO1xyXG5cclxudmFyIGNvbmZpZyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC50YXNrc1wiLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvdGFzay9saXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcInRhc2tsaXN0Q29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJ0YXNrc0N0cmxcIixcclxuICAgICAgICB1cmw6IFwidGFza3NcIlxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LnRhc2tcIiwge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svdGFzay5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJ0YXNrQ29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJ0YXNrQ3RybFwiLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgdGFzazogcmVzb2x2ZVRhc2tcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVybDogXCJ0YXNrLzp0YXNrSWRcIlxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LnRhc2suYWxsb2NhdGlvblwiLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvdGFzay9hbGxvY2F0aW9uL2xpc3QuaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwiYWxsb2NhdGlvbkxpc3RDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImFsbG9jYXRpb25MaXN0Q3RybFwiLFxyXG4gICAgICAgIHVybDogXCIvYWxsb2NhdGlvblwiXHJcbiAgICB9KTtcclxufTtcclxuY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsIlxyXG52YXIgdGFza0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHEsICRzdGF0ZSwgcHJvamVjdCwgY3VycmVudHRhc2ssIHRhc2tBc3NlbWJsZXJTZXJ2aWNlLCBhbGxvY2F0aW9uU2VydmljZSwgZ3Jvd2wsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5jdXN0b21GaWVsZE1hcCA9IHt9O1xyXG4gICAgdm0udGFzayA9IGN1cnJlbnR0YXNrO1xyXG5cclxuICAgIHZtLmFsbG9jYXRpb24gPSBhbGxvY2F0aW9uU2VydmljZS5sb2FkQWxsb2NhdGlvbihhcHBQYXJhbWV0ZXJzKTtcclxuICAgIC8vdm0udGFzay5kZXNjcmlwdGlvbjtcclxuICAgIHByb2plY3QuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY3VycmVudHRhc2suJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnRhc2sgPSB0YXNrQXNzZW1ibGVyU2VydmljZShjdXJyZW50dGFzayk7XHJcbiAgICAgICAgICAgIHZtLmNoaWxkcmVuID0gdm0udGFzay5yZXNvdXJjZShcImNoaWxkcmVuXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgIHZtLnBhcmVudHMgPSB2bS50YXNrLnJlc291cmNlKFwicGFyZW50c1wiKS5xdWVyeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZtLmNhdGVnb3JpZXMgPSBwcm9qZWN0LnJlc291cmNlKFwiY2F0ZWdvcnlcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zdGF0ZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICB2YXIgY3VzdG9tZmllbGRzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tmaWVsZFwiKS5xdWVyeSgpO1xyXG4gICAgICAgICRxLmFsbChbY3VzdG9tZmllbGRzLiRwcm9taXNlLCBjdXJyZW50dGFzay4kcHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdm0udGFzay5jdXN0b21GaWVsZCA9IFtdO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YVswXSwgZnVuY3Rpb24gKGN1c3RvbUZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jdXN0b21GaWVsZE1hcFtjdXN0b21GaWVsZC5maWVsZE5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmluaXRpb246IGN1c3RvbUZpZWxkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdm0udGFzay5jdXN0b21GaWVsZC5wdXNoKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdm0udGFzay5yZXNvdXJjZShcImN1c3RvbWZpZWxkXCIpLnF1ZXJ5KGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGN1c3RvbUZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZGVmaW5pdGlvbi50eXBlID09PSBcIk5VTUJFUlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IHBhcnNlRmxvYXQoY3VzdG9tRmllbGQuZmllbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5jdXN0b21GaWVsZE1hcFtjdXN0b21GaWVsZC5maWVsZE5hbWVdLmRlZmluaXRpb24udHlwZSA9PT0gXCJEQVRFXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VzdG9tRmllbGRNYXBbY3VzdG9tRmllbGQuZmllbGROYW1lXS5maWVsZFZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbUZpZWxkLmZpZWxkVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IG5ldyBEYXRlKGN1c3RvbUZpZWxkLmZpZWxkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZGVmaW5pdGlvbi5yZXF1aXJlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VzdG9tRmllbGRNYXBbY3VzdG9tRmllbGQuZmllbGROYW1lXS5maWVsZFZhbHVlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IGN1c3RvbUZpZWxkLmZpZWxkVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB2bS5zZWxlY3RBc3NpZ25lZSA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2YXIgdXNlckFscmVhZHlBc3NpZ25lZCA9IGZhbHNlO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS50YXNrLmFzc2lnbmVlcywgZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgaWYgKHVzZXIuaWQgPT09ICRtb2RlbC5pZCkge1xyXG4gICAgICAgICAgICAgICAgdXNlckFscmVhZHlBc3NpZ25lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBncm93bC5lcnJvcihcIlV0aWxpc2F0ZXVyIGTDqWrDoCBhc3NpZ27DqVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghdXNlckFscmVhZHlBc3NpZ25lZCkge1xyXG4gICAgICAgICAgICB2bS50YXNrLmFzc2lnbmVlcy5wdXNoKCRtb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnJlbW92ZXVzZXIgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2bS50YXNrLmFzc2lnbmVlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIHZtLmdldE1lbWJlcnMgPSBmdW5jdGlvbiAodGVybSkge1xyXG4gICAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5hZGRDaGlsZCA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2bS50YXNrLnJlc291cmNlKFwiY2hpbGRyZW5cIikuc2F2ZSgkaXRlbSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5jaGlsZHJlbi5wdXNoKCRpdGVtKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5hZGRQYXJlbnQgPSBmdW5jdGlvbiAoJGl0ZW0sICRtb2RlbCwgJGxhYmVsKSB7XHJcbiAgICAgICAgdm0udGFzay5yZXNvdXJjZShcInBhcmVudHNcIikuc2F2ZSgkaXRlbSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5wYXJlbnRzLnB1c2goJGl0ZW0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdm0uY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH07XHJcbiAgICB2bS5yZW1vdmVQYXJlbnQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2bS5wYXJlbnRzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9O1xyXG4gICAgdm0uZ2V0VGFza3MgPSBmdW5jdGlvbiAodGVybSkge1xyXG4gICAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlKFwidGFza1wiKS5xdWVyeSh7aWRUYXNrIDogdm0udGFzay5pZCxzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLnRhc2suY3VzdG9tRmllbGQsIGZ1bmN0aW9uIChjdXN0b21GaWVsZCkge1xyXG4gICAgICAgICAgICBpZiAodm0uY3VzdG9tRmllbGRNYXBbY3VzdG9tRmllbGQuZGVmaW5pdGlvbi5maWVsZE5hbWVdLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBjdXN0b21GaWVsZC52YWx1ZSA9IHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmRlZmluaXRpb24uZmllbGROYW1lXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZtLnRhc2sucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUodm0udGFzaywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwiYXBwLnByb2plY3Qua2FuYmFuXCIsIHtwcm9qZWN0SWQ6IHByb2plY3QuaWR9KTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxudGFza0NvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRxXCIsIFwiJHN0YXRlXCIsIFwicHJvamVjdFwiLCBcInRhc2tcIiwgXCJ0YXNrQXNzZW1ibGVyU2VydmljZVwiLCBcImFsbG9jYXRpb25TZXJ2aWNlXCIsIFwiZ3Jvd2xcIiwgXCJhcHBQYXJhbWV0ZXJzXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHRhc2tDb250cm9sbGVyO1xyXG4iLCJ2YXIgY29tbWVudE1vZHVsZSA9IHJlcXVpcmUoXCIuL2NvbW1lbnQvY29tbWVudC5tb2R1bGVcIik7XHJcbnZhciBhbGxvY2F0aW9uTW9kdWxlID0gcmVxdWlyZShcIi4vYWxsb2NhdGlvbi9hbGxvY2F0aW9uLm1vZHVsZVwiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL3Rhc2suY29uZmlnXCIpO1xyXG52YXIgYWRkVGFza0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hZGQuY29udHJvbGxlclwiKTtcclxudmFyIHRhc2tsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxudmFyIHRhc2tDb250cm9sbGVyID0gcmVxdWlyZShcIi4vdGFzay5jb250cm9sbGVyXCIpO1xyXG52YXIgaGlzdG9Nb2R1bGUgPSByZXF1aXJlKFwiLi9oaXN0b3J5L2hpc3RvcnkubW9kdWxlXCIpO1xyXG52YXIgdGFza1NlcnZpY2UgPSByZXF1aXJlKFwiLi90YXNrLnNlcnZpY2VcIik7XHJcbnZhciB0YXNrQXNzZW1ibGVyU2VydmljZSA9IHJlcXVpcmUoXCIuL3Rhc2tBc3NlbWJsZXIuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QudGFzaycsIFtjb21tZW50TW9kdWxlLm5hbWUsIGFsbG9jYXRpb25Nb2R1bGUubmFtZSwgaGlzdG9Nb2R1bGUubmFtZV0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRUYXNrQ29udHJvbGxlclwiLCBhZGRUYXNrQ29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcInRhc2tsaXN0Q29udHJvbGxlclwiLCB0YXNrbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJ0YXNrQ29udHJvbGxlclwiLCB0YXNrQ29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcInRhc2tTZXJ2aWNlXCIsIHRhc2tTZXJ2aWNlKVxyXG4gICAgICAgIC5zZXJ2aWNlKFwidGFza0Fzc2VtYmxlclNlcnZpY2VcIiwgdGFza0Fzc2VtYmxlclNlcnZpY2UpOyIsInZhciB0YXNrU2VydmljZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3Byb2plY3QvOnByb2plY3RJZC90YXNrLzp0YXNrSWRcIiwge3Byb2plY3RJZDogXCJAcHJvamVjdElkXCIsIGlkOiBcIkB0YXNrSWRcIn0pO1xyXG59O1xyXG50YXNrU2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHRhc2tTZXJ2aWNlOyIsInZhciB0YXNrQXNzZW1ibGVyU2VydmljZSA9IGZ1bmN0aW9uICgkaHR0cCwgSGF0ZW9hc0ludGVyZmFjZSwgbW9tZW50KSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICB2YXIgdGFza3Jlc291cmNlID0gdGFzaztcclxuICAgICAgICBpZiAoIXRhc2sucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgdGFza3Jlc291cmNlID0gbmV3IEhhdGVvYXNJbnRlcmZhY2UodGFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhc2suc3RhdGUgPSB0YXNrcmVzb3VyY2UucmVzb3VyY2UoXCJzdGF0ZVwiKS5nZXQoKTtcclxuICAgICAgICBpZiAodGFzay5fbGlua3MuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgdGFzay5jYXRlZ29yeSA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcImNhdGVnb3J5XCIpLmdldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFzay5fbGlua3Muc3dpbWxhbmUpIHtcclxuICAgICAgICAgICAgdGFzay5zd2ltbGFuZSA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcInN3aW1sYW5lXCIpLmdldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXNrLmFzc2lnbmVlcyA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcImFzc2lnbmVlXCIpLnF1ZXJ5KGZ1bmN0aW9uIChhc3NpZ25lZXMpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFzc2lnbmVlcywgZnVuY3Rpb24gKGFzc2lnbmVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWduZWUuX2xpbmtzLnBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGFzc2lnbmVlLl9saW5rcy5waG90bykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbmVlLnBob3RvID0gcmVzdWx0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoYXNzaWduZWUuX2xpbmtzLnVzZXIpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbmVlLnVzZXJJZCA9IHJlc3VsdC5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzaWduZWVzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRhc2suZXhjZWVkZWRMb2FkID0gKHRhc2sudGltZVJlbWFpbnMgKyB0YXNrLnRpbWVTcGVudCA+IHRhc2suZXN0aW1hdGVkTG9hZCk7XHJcbiAgICAgICAgaWYgKHRhc2tyZXNvdXJjZS5wbGFubmVkRW5kaW5nICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2RheSA9IG1vbWVudCgpO1xyXG4gICAgICAgICAgICB0YXNrLnBsYW5uZWRFbmRpbmcgPSBtb21lbnQodGFza3Jlc291cmNlLnBsYW5uZWRFbmRpbmcpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgICB0YXNrLnN0YXRlLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGFzay5leGNlZWRlZERhdGUgPSAodG9kYXkuaXNBZnRlcih0YXNrLnBsYW5uZWRFbmRpbmcsICdkYXknKSAmJiAhdGFzay5zdGF0ZS5jbG9zZVN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YXNrcmVzb3VyY2UucGxhbm5lZFN0YXJ0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRhc2sucGxhbm5lZFN0YXJ0ID0gbW9tZW50KHRhc2tyZXNvdXJjZS5wbGFubmVkU3RhcnQpLnRvRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFzaztcclxuICAgIH07XHJcbn07XHJcbnRhc2tBc3NlbWJsZXJTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIiwgXCJtb21lbnRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdGFza0Fzc2VtYmxlclNlcnZpY2U7Il19
