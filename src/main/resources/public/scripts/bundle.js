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
        vm.searchedTask = '';
    };
    vm.getTasks = function (term) {
        return currentuser.resource("search").query({ search: term }).$promise;
    };
    vm.libelleResearch = function (task) {
        var libelle = '';
        if (task !== undefined && task !== '') {
            libelle = '#' + task.id + ' - ' + task.name;
        }
        return libelle;
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
        error = {};
        error.messages = [{ message: "Les mots de passe saisis ne correspondent pas" }];
    }
    return error;
};
module.exports = function () {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            password: "=password",
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
        template: function (element, attrs) {
            var htmlText = '<input type="password" ';
            var required = attrs.required;
            var placeholder = attrs.placeholder;
            if (required === "required") {
                htmlText += 'required="required" ';
            }
            htmlText += 'class="form-control" id = "rePassword" placeholder = "' + placeholder + '" / > ';
            return htmlText;
        }
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
                vm.states = project.resource("state").query({ "order": "position", "kanban": true });
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
    vm.page = 0;
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

var taskController = function ($q, $state, $uibModal, project, currenttask, taskAssemblerService, allocationService, growl, appParameters) {
    var vm = this;
    vm.customFieldMap = {};
    vm.task = currenttask;

    vm.allocation = allocationService.loadAllocation(appParameters);
    project.$promise.then(function () {
        currenttask.$promise.then(function () {
            vm.task = taskAssemblerService(currenttask);
            vm.task.parentId = [];
            vm.task.childrenId = [];

            vm.task.children = vm.task.resource("children").query();
            vm.task.children.$promise.then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    vm.task.childrenId.push(data[i].id);
                }
            });
            vm.task.parent = vm.task.resource("parents").query();
            vm.task.parent.$promise.then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    vm.task.parentId.push(data[i].id);
                }
            });
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
    vm.chechNotAlreadyInParentOrChild = function (task) {
        var isNotPresent = true;
        if (vm.task.childrenId.indexOf(task.id) > -1 || vm.task.parentId.indexOf(task.id) > -1) {
            isNotPresent = false;
        }
        return isNotPresent;
    };
    vm.addChild = function ($item, $model, $label) {
        if (vm.chechNotAlreadyInParentOrChild($item)) {
            vm.task.resource("children").query({ linkedTaskId: $item.id }, function () {
                vm.task.children.push($item);
                vm.task.childrenId.push($item.id);
            });
        }
        vm.selectedChild = null;
    };
    vm.addParent = function ($item, $model, $label) {
        if (vm.chechNotAlreadyInParentOrChild($item)) {
            vm.task.resource("parents").query({ linkedTaskId: $item.id }, function () {
                vm.task.parent.push($item);
                vm.task.parentId.push($item.id);
            });
        }
        vm.selectedParent = null;
    };
    vm.removeChild = function (index) {
        vm.task.children.splice(index, 1);
        vm.task.childrenId.splice(index, 1);
    };
    vm.removeParent = function (index) {
        vm.task.parent.splice(index, 1);
        vm.task.parentId.splice(index, 1);
    };
    vm.getTasks = function (term) {
        return project.resource("task").query({ idTask: vm.task.id, search: term }).$promise.then(function (data) {
            var resultWithoutDuplicate = [];
            for (i = 0; i < data.length; i++) {
                if (vm.chechNotAlreadyInParentOrChild(data[i])) {
                    resultWithoutDuplicate.push(data[i]);
                }
            }
            return resultWithoutDuplicate;
        });
    };
    vm.formatLibelle = function (task) {
        var libelle = '';
        if (task !== undefined && task !== null) {
            libelle = '#' + task.id + ' - ' + task.name;
        }
        return libelle;
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
taskController.$inject = ["$q", "$state", "$uibModal", "project", "task", "taskAssemblerService", "allocationService", "growl", "appParameters"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxhZG1pbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXGNhdGVnb3J5XFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXGNhdGVnb3J5XFxjYXRlZ29yeS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxjYXRlZ29yeVxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcZWRpdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbWVtYmVyXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXG1lbWJlclxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcbWVtYmVyXFxtZW1iZXIubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxccHJvamVjdC5jb25maWcuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxwcm9qZWN0Lm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN0YXRlXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN0YXRlXFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFxzdGF0ZVxcc3RhdGUubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcc3dpbWxhbmVcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcc3dpbWxhbmVcXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHN3aW1sYW5lXFxzd2ltbGFuZS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFx0YXNrZmllbGRcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2ZpZWxkXFxmaWVsZHR5cGUuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHByb2plY3RcXHRhc2tmaWVsZFxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2ZpZWxkXFx0YXNrZmllbGQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxccHJvamVjdFxcdGFza2hpc3RvXFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFxwcm9qZWN0XFx0YXNraGlzdG9cXHRhc2toaXN0by5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHVzZXJcXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYWRtaW5cXHVzZXJcXHVzZXIuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhZG1pblxcdXNlclxcdXNlci5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFx1c2VyLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGFkbWluXFx1c2VyXFx1c2Vycm9sZS5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcYXBwLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxhcHAucnVuLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxkYXNoYm9hcmRcXGNhbGVuZGFyXFxhZGRpbXB1dGF0aW9uLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRhc2hib2FyZFxcZGFzaGJvYXJkLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcZGlyZWN0aXZlXFxjaGVja2JveGZpbHRlci5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRpcmVjdGl2ZVxcZXJyb3IuZGlyZWN0aXZlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxkaXJlY3RpdmVcXHNhbWVQYXNzd29yZC5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGRpcmVjdGl2ZVxcdG9nZ2xlci5kaXJlY3RpdmUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGxvZ2luXFxhdXRoLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXGxvZ2luXFxjdXJyZW50dXNlci5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxsb2dpblxcbG9naW4uY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxcbG9naW5cXGxvZ2luLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccGFyYW1ldGVyXFxhbGxvY2F0aW9uLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHBhcmFtZXRlclxcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwYXJhbWV0ZXJcXHBhcmFtZXRlci5jb25maWcuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHBhcmFtZXRlclxccGFyYW1ldGVyLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccGFyYW1ldGVyXFxwYXJhbWV0ZXIuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvZmlsXFxwcm9maWwuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcY29uc29tbWF0aW9uXFxjb25zb21tYXRpb24uY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxjb25zb21tYXRpb25cXGNvbnNvbW1hdGlvbi5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxjb25zb21tYXRpb25cXGNvbnNvbW1hdGlvbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGNvbnNvbW1hdGlvblxcY29uc29tbWF0aW9uLnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGdhbnR0XFxnYW50dC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxnYW50dFxcZ2FudHQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxnYW50dFxcZ2FudHQuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxca2FuYmFuXFxrYW5iYW4uY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxca2FuYmFuXFxrYW5iYW4ubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxrYW5iYW5cXGthbmJhbi5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxrYW5iYW5cXHVyZ2VudC5maWx0ZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXGthbmJhblxcdXNlci5maWx0ZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHByb2plY3QuY29uZmlnLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHByb2plY3QubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFxwcm9qZWN0LnNlcnZpY2UuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGFkZC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFxhbGxvY2F0aW9uXFxhZGQuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcYWxsb2NhdGlvblxcYWxsb2NhdGlvbi5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGFsbG9jYXRpb25cXGxpc3QuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcY29tbWVudFxcYWRkLmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGNvbW1lbnRcXGNvbW1lbnQubW9kdWxlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFxjb21tZW50XFxsaXN0LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGNvbW1lbnRcXHJlcGx5LmNvbnRyb2xsZXIuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGhpc3RvcnlcXGhpc3RvcnkuY29udHJvbGxlci5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcaGlzdG9yeVxcaGlzdG9yeS5tb2R1bGUuanMiLCJzcmNcXG1haW5cXHJlc291cmNlc1xccHVibGljXFxzY3JpcHRzXFxhcHBcXHByb2plY3RcXHRhc2tcXGhpc3RvcnlcXGhpc3Rvcnkuc2VydmljZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcbGlzdC5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrLmNvbmZpZy5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcdGFzay5jb250cm9sbGVyLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrLm1vZHVsZS5qcyIsInNyY1xcbWFpblxccmVzb3VyY2VzXFxwdWJsaWNcXHNjcmlwdHNcXGFwcFxccHJvamVjdFxcdGFza1xcdGFzay5zZXJ2aWNlLmpzIiwic3JjXFxtYWluXFxyZXNvdXJjZXNcXHB1YmxpY1xcc2NyaXB0c1xcYXBwXFxwcm9qZWN0XFx0YXNrXFx0YXNrQXNzZW1ibGVyLnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFJLGdCQUFnQixRQUFRLDBCQUFSLENBQXBCO0FBQ0EsSUFBSSxhQUFhLFFBQVEsb0JBQVIsQ0FBakI7QUFDQSxPQUFPLE9BQVAsR0FBaUIsUUFBUSxNQUFSLENBQWUsY0FBZixFQUNULENBQUMsY0FBYyxJQUFmLEVBQXFCLFdBQVcsSUFBaEMsQ0FEUyxDQUFqQjs7O0FDRkEsSUFBSSxnQkFBZ0IsVUFBVSxpQkFBVixFQUE2QixRQUE3QixFQUF1QztBQUN2RCxRQUFJLEtBQUssSUFBVDtBQUNBLE9B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QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLElBQXBCLENBQXlCLFlBQVk7QUFDakMscUJBQUssWUFBTCxHQUFxQixNQUFNLE9BQU4sQ0FBYyxLQUFLLGFBQW5CLEVBQWtDLEtBQWxDLEtBQTRDLENBQUMsS0FBSyxLQUFMLENBQVcsVUFBN0U7QUFDSCxhQUZEO0FBR0g7QUFDRCxZQUFJLGFBQWEsWUFBYixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyxpQkFBSyxZQUFMLEdBQW9CLE9BQU8sYUFBYSxZQUFwQixFQUFrQyxNQUFsQyxFQUFwQjtBQUNIO0FBQ0QsZUFBTyxJQUFQO0FBQ0gsS0FyQ0Q7QUFzQ0gsQ0F2Q0Q7QUF3Q0EscUJBQXFCLE9BQXJCLEdBQStCLENBQUMsT0FBRCxFQUFVLGtCQUFWLEVBQThCLFFBQTlCLENBQS9CO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLG9CQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvamVjdE1vZHVsZSA9IHJlcXVpcmUoXCIuL3Byb2plY3QvcHJvamVjdC5tb2R1bGVcIik7XHJcbnZhciB1c2VyTW9kdWxlID0gcmVxdWlyZShcIi4vdXNlci91c2VyLm1vZHVsZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluJyxcclxuICAgICAgICBbcHJvamVjdE1vZHVsZS5uYW1lLCB1c2VyTW9kdWxlLm5hbWVdKTtcclxuIiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHByb2plY3RzKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByb2plY3RzLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKHZtLnByb2plY3QsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJwcm9qZWN0c1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyO1xyXG4iLCJ2YXIgYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwgcHJvamVjdCkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwiY2F0ZWdvcnlcIikuc2F2ZSh2bS5jYXRlZ29yeSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICB2bS5lcnJvciA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59O1xyXG5hZGRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiLCBcInByb2plY3RcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5hZG1pbi5wcm9qZWN0LmNhdGVnb3J5JywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJsaXN0Q2F0ZWdvcnlBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRDYXRlZ29yeUFkbWluQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKTsiLCIgICAgICAgIHZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdm0uYWRkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L2NhdGVnb3J5L2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRDYXRlZ29yeUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRDYXRlZ29yeUN0cmxcIixcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IFwibWRcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5LnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZtLnNhdmVDYXRlZ29yeSA9IGZ1bmN0aW9uIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNhdGVnb3J5LnJlc291cmNlKFwic2VsZlwiKS5zYXZlKGNhdGVnb3J5KS4kcHJvbWlzZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5yZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jYXRlZ29yaWVzID0gcHJvamVjdC5yZXNvdXJjZShcImNhdGVnb3J5XCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGlzdENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInByb2plY3RcIl07XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgZWRpdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHN0YXRlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0ucHJvamVjdCA9IHByb2plY3Q7XHJcbiAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwiYXBwLnByb2plY3QuZWRpdC50YXNrZmllbGRcIiwge3Byb2plY3RJZDogcHJvamVjdC5pZH0pO1xyXG59O1xyXG5lZGl0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHN0YXRlXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBlZGl0Q29udHJvbGxlcjtcclxuXHJcblxyXG4iLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBzY29wZSwgcHJvamVjdFNlcnZpY2UsIEhhdGVvYXNJbnRlcmZhY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICBmdW5jdGlvbiBsb2FkUGFnZSgpIHtcclxuICAgICAgICByZXR1cm4gcHJvamVjdFNlcnZpY2UuZ2V0KHtwYWdlOiB2bS5wcm9qZWN0cy5wYWdlLm51bWJlciwgc2l6ZTogdm0ucHJvamVjdHMucGFnZS5zaXplfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodm0ucHJvamVjdHMuX2VtYmVkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godm0ucHJvamVjdHMuX2VtYmVkZGVkLnByb2plY3RSZXNvdXJjZUxpc3QsIGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdC5zdGF0ZXMgPSBuZXcgSGF0ZW9hc0ludGVyZmFjZShwcm9qZWN0KS5yZXNvdXJjZShcInN0YXRlXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Q7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdm0ucHJvamVjdHMgPSB7XHJcbiAgICAgICAgcGFnZToge1xyXG4gICAgICAgICAgICBudW1iZXI6IDAsXHJcbiAgICAgICAgICAgIHNpemU6IDE1XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnByb2plY3RzID0gbG9hZFBhZ2UoKTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFByb2plY3RDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3RzOiB2bS5wcm9qZWN0c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2NvcGUuJGVtaXQoXCJrYW5iYW46cHJvamVjdHMtdXBkYXRlc1wiKTtcclxuICAgICAgICAgICAgdm0ucHJvamVjdHMgPSBsb2FkUGFnZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UocHJvamVjdCkucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNjb3BlLiRlbWl0KFwia2FuYmFuOnByb2plY3RzLXVwZGF0ZXNcIik7XHJcbiAgICAgICAgICAgIHZtLnByb2plY3RzID0gbG9hZFBhZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCIkc2NvcGVcIiwgXCJwcm9qZWN0U2VydmljZVwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gbGlzdENvbnRyb2xsZXI7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHVzZXJTZXJ2aWNlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc2VsZWN0VXNlciA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2bS5tZW1iZXIudXNlciA9ICRtb2RlbDtcclxuICAgIH07XHJcbiAgICB2bS5nZXRVc2VycyA9IGZ1bmN0aW9uICh0ZXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJTZXJ2aWNlLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5wcm9qZWN0Um9sZXMgPSBwcm9qZWN0LnJlc291cmNlKFwicm9sZXNcIikucXVlcnkoKTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLnNhdmUodm0ubWVtYmVyLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwidXNlclNlcnZpY2VcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgSGF0ZW9hc0ludGVyZmFjZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnByb2plY3RSb2xlcyA9IHByb2plY3QucmVzb3VyY2UoXCJyb2xlc1wiKS5xdWVyeSgpO1xyXG4gICAgdm0ubWVtYmVycyA9IHtcclxuICAgICAgICBwYWdlOiB7XHJcbiAgICAgICAgICAgIG51bWJlcjogMCxcclxuICAgICAgICAgICAgc2l6ZTogMTVcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdm0ubWVtYmVycyA9IHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikuZ2V0KFxyXG4gICAgICAgICAgICB7cGFnZTogdm0ubWVtYmVycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLm1lbWJlcnMucGFnZS5zaXplfSk7XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvbWVtYmVyL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkTWVtYmVyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRNZW1iZXJDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLm1lbWJlcnMgPSBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLmdldChcclxuICAgICAgICAgICAgICAgICAgICB7cGFnZTogdm0ubWVtYmVycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogdm0ubWVtYmVycy5wYWdlLnNpemV9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5kZWxldGUgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UobWVtYmVyKS5yZXNvdXJjZShcInNlbGZcIikuZGVsZXRlKG51bGwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0ubWVtYmVycyA9IHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikuZ2V0KFxyXG4gICAgICAgICAgICAgICAgICAgIHtwYWdlOiB2bS5tZW1iZXJzLnBhZ2UubnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplOiB2bS5tZW1iZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVNZW1iZXIgPSBmdW5jdGlvbiAobWVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBIYXRlb2FzSW50ZXJmYWNlKG1lbWJlcikucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUobWVtYmVyKS4kcHJvbWlzZTtcclxuICAgICAgICByZXN1bHQuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmRhdGEgPSBlcnJvci5kYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCJwcm9qZWN0XCIsIFwiSGF0ZW9hc0ludGVyZmFjZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5hZG1pbi5wcm9qZWN0Lm1lbWJlcicsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdE1lbWJlckFkbWluQ29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcImFkZE1lbWJlckFkbWluQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKTtcclxuIiwiICAgICAgICB2YXIgY29uZmlnID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3RzXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJwcm9qZWN0TGlzdEFkbWluQ3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwicHJvamVjdFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXRcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJlZGl0UHJvamVjdEFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInByb2plY3RFZGl0Q3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvcHJvamVjdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiZWRpdFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXQuY2F0ZWdvcnlcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0Q2F0ZWdvcnlBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJjYXRlZ29yeUxpc3RDdHJsXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9jYXRlZ29yeS9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY2F0ZWdvcnlcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC5lZGl0LnN3aW1sYW5lXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFN3aW1sYW5lQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwic3dpbWxhbmVMaXN0Q3RybFwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3Qvc3dpbWxhbmUvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3N3aW1sYW5lXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC5tZW1iZXJcIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0TWVtYmVyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwibWVtYmVyTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L21lbWJlci9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvbWVtYmVyXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC5zdGF0ZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImxpc3RTdGF0ZUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInN0YXRlTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L3N0YXRlL2xpc3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9zdGF0ZVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmVkaXQudGFza2ZpZWxkXCIsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibGlzdFRhc2tmaWVsZEFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInRhc2tmaWVsZExpc3RDdHJsXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC90YXNrZmllbGQvbGlzdC5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2N1c3RvbWZpZWxkXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuZWRpdC50YXNraGlzdG9cIiwge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsaXN0VGFza0hpc3RvQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwidGFza0hpc3RvTGlzdEN0cmxcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9hZG1pbi9wcm9qZWN0L3Rhc2toaXN0by9saXN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvdGFza0hpc3RvXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG5cclxuIiwidmFyIHN0YXRlTW9kdWxlID0gcmVxdWlyZShcIi4vc3RhdGUvc3RhdGUubW9kdWxlXCIpO1xyXG52YXIgY2F0ZWdvcnlNb2R1bGUgPSByZXF1aXJlKFwiLi9jYXRlZ29yeS9jYXRlZ29yeS5tb2R1bGVcIik7XHJcbnZhciBzd2ltbGFuZU1vZHVsZSA9IHJlcXVpcmUoXCIuL3N3aW1sYW5lL3N3aW1sYW5lLm1vZHVsZVwiKTtcclxudmFyIG1lbWJlck1vZHVsZSA9IHJlcXVpcmUoXCIuL21lbWJlci9tZW1iZXIubW9kdWxlXCIpO1xyXG52YXIgdGFza2ZpZWxkTW9kdWxlID0gcmVxdWlyZShcIi4vdGFza2ZpZWxkL3Rhc2tmaWVsZC5tb2R1bGVcIik7XHJcbnZhciB0YXNrSGlzdG9Nb2R1bGUgPSByZXF1aXJlKFwiLi90YXNraGlzdG8vdGFza2hpc3RvLm1vZHVsZVwiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL3Byb2plY3QuY29uZmlnXCIpO1xyXG52YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbnZhciBlZGl0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2VkaXQuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QnLFxyXG4gICAgICAgIFtcImthbmJhbi5wcm9qZWN0XCIsIHN0YXRlTW9kdWxlLm5hbWUsIGNhdGVnb3J5TW9kdWxlLm5hbWUsXHJcbiAgICAgICAgICAgIHN3aW1sYW5lTW9kdWxlLm5hbWUsIG1lbWJlck1vZHVsZS5uYW1lLCB0YXNrZmllbGRNb2R1bGUubmFtZSwgdGFza0hpc3RvTW9kdWxlLm5hbWVdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFByb2plY3RBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRQcm9qZWN0QWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJlZGl0UHJvamVjdEFkbWluQ29udHJvbGxlclwiLCBlZGl0Q29udHJvbGxlcik7IiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJvamVjdC5yZXNvdXJjZShcInN0YXRlXCIpLnNhdmUodm0uc3RhdGUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoKTtcclxuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgZ3Jvd2wpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5zdGF0ZUxpc3RTb3J0T3B0aW9ucyA9IHtcclxuICAgICAgICBvcmRlckNoYW5nZWQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgc3RhdGVVcGRhdGVkID0gZXZlbnQuc291cmNlLml0ZW1TY29wZS5tb2RlbFZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSBldmVudC5kZXN0LmluZGV4O1xyXG4gICAgICAgICAgICBzdGF0ZVVwZGF0ZWQucG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuICAgICAgICAgICAgc3RhdGVVcGRhdGVkLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKG51bGwsIHN0YXRlVXBkYXRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vcHJvamVjdC9zdGF0ZS9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFN0YXRlQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRTdGF0ZUN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogcHJvamVjdFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0ucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgc3RhdGUucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBncm93bC5lcnJvcihlcnJvci5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBzdGF0ZS5yZXNvdXJjZShcInNlbGZcIikuc2F2ZShzdGF0ZSkuJHByb21pc2U7XHJcbiAgICAgICAgcmVzdWx0LmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBlcnJvci5kYXRhID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZtLnN0YXRlcyA9IHByb2plY3QucmVzb3VyY2UoXCJzdGF0ZVwiKS5xdWVyeSgpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcImdyb3dsXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxudmFyIGFkZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hZGQuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3Quc3RhdGUnLCBbJ2FuZ3VsYXItZ3Jvd2wnXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImxpc3RTdGF0ZUFkbWluQ29udHJvbGxlclwiLCBsaXN0Q29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcImFkZFN0YXRlQWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpOyIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByb2plY3QucmVzb3VyY2UoXCJzd2ltbGFuZVwiKS5zYXZlKHZtLnN3aW1sYW5lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyO1xyXG4iLCJcclxudmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgbW9tZW50KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uc3dpbWxhbmVMaXN0U29ydE9wdGlvbnMgPSB7XHJcbiAgICAgICAgb3JkZXJDaGFuZ2VkOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHN3aW1sYW5lVXBkYXRlZCA9IGV2ZW50LnNvdXJjZS5pdGVtU2NvcGUubW9kZWxWYWx1ZTtcclxuICAgICAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gZXZlbnQuZGVzdC5pbmRleDtcclxuICAgICAgICAgICAgc3dpbWxhbmVVcGRhdGVkLnBvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcbiAgICAgICAgICAgIHN3aW1sYW5lVXBkYXRlZC5yZXNvdXJjZShcInNlbGZcIikuc2F2ZShudWxsLCBzd2ltbGFuZVVwZGF0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3Qvc3dpbWxhbmUvYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRTd2ltbGFuZUFkbWluQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkU3dpbWxhbmVDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChzd2ltbGFuZSkge1xyXG4gICAgICAgIHN3aW1sYW5lLnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5yZWxvYWQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5zYXZlU3dpbWxhbmUgPSBmdW5jdGlvbiAoc3dpbWxhbmUpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gc3dpbWxhbmUucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUoc3dpbWxhbmUpLiRwcm9taXNlO1xyXG4gICAgICAgIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgZXJyb3IuZGF0YSA9IGVycm9yLmRhdGEubWVzc2FnZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKHN3aW1sYW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3dpbWxhbmUuZW5kUGxhbm5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aW1sYW5lLmVuZFBsYW5uZWQgPSBtb21lbnQoc3dpbWxhbmUuZW5kUGxhbm5lZCkudG9EYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcIm1vbWVudFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjtcclxuIiwidmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgYWRkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FkZC5jb250cm9sbGVyXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4uYWRtaW4ucHJvamVjdC5zd2ltbGFuZScsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFN3aW1sYW5lQWRtaW5Db250cm9sbGVyXCIsIGxpc3RDb250cm9sbGVyKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiYWRkU3dpbWxhbmVBZG1pbkNvbnRyb2xsZXJcIiwgYWRkQ29udHJvbGxlcik7XHJcbiIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwcm9qZWN0LCBmaWVsZHR5cGVTZXJ2aWNlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uZmllbGRUeXBlcyA9IGZpZWxkdHlwZVNlcnZpY2UucXVlcnkoKTtcclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBwcm9qZWN0LnJlc291cmNlKFwidGFza2ZpZWxkXCIpLnNhdmUodm0udGFza2ZpZWxkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwicHJvamVjdFwiLCBcImZpZWxkdHlwZVNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ29udHJvbGxlcjsiLCJ2YXIgZmllbGRUeXBlU2VydmljZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3Rhc2tmaWVsZHR5cGVcIik7XHJcbn07XHJcbmZpZWxkVHlwZVNlcnZpY2UuJGluamVjdCA9IFtcIiRyZXNvdXJjZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBmaWVsZFR5cGVTZXJ2aWNlOyIsInZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3Byb2plY3QvdGFza2ZpZWxkL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVGFza2ZpZWxkQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJhZGRUYXNrZmllbGRDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IHByb2plY3RcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uICh0YXNrZmllbGQpIHtcclxuICAgICAgICB0YXNrZmllbGQucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS50YXNrZmllbGRzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tmaWVsZFwiKS5xdWVyeSgpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbnZhciBmaWVsZHR5cGVTcnYgPSByZXF1aXJlKFwiLi9maWVsZHR5cGUuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QudGFza2ZpZWxkJywgW10pXHJcbiAgICAgICAgLnNlcnZpY2UoXCJmaWVsZHR5cGVTZXJ2aWNlXCIsIGZpZWxkdHlwZVNydilcclxuICAgICAgICAuY29udHJvbGxlcihcImxpc3RUYXNrZmllbGRBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRUYXNrZmllbGRBZG1pbkNvbnRyb2xsZXJcIiwgYWRkQ29udHJvbGxlcik7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5yZWxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0udGFza3NoaXN0byA9IHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KCk7XHJcbiAgICB9O1xyXG4gICAgdm0ucmVsb2FkKCk7XHJcbn07XHJcbmxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmFkbWluLnByb2plY3QudGFza2hpc3RvJywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJsaXN0VGFza0hpc3RvQWRtaW5Db250cm9sbGVyXCIsIGxpc3RDb250cm9sbGVyKTsiLCJ2YXIgYWRkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwgdXNlclJvbGVTZXJ2aWNlLCB1c2VyU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnJvbGVzID0gdXNlclJvbGVTZXJ2aWNlLnF1ZXJ5KCk7XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF2bS5lcnJvcikge1xyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5zYXZlKHZtLnVzZXIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdm0uZXJyb3IgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5hZGRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxJbnN0YW5jZVwiLCBcInVzZXJSb2xlU2VydmljZVwiLCBcInVzZXJTZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFkZENvbnRyb2xsZXI7IiwidmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgSGF0ZW9hc0ludGVyZmFjZSwgdXNlclNlcnZpY2UsIHVzZXJSb2xlU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnVzZXJzID0ge1xyXG4gICAgICAgIHBhZ2U6IHtcclxuICAgICAgICAgICAgbnVtYmVyOiAwLFxyXG4gICAgICAgICAgICBzaXplOiAxNVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS51c2VyUm9sZXMgPSB1c2VyUm9sZVNlcnZpY2UucXVlcnkoKTtcclxuICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICBzaXplOiB2bS51c2Vycy5wYWdlLnNpemV9KTtcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vdXNlci9hZGQuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImFkZFVzZXJBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFVzZXJBZG1pbkN0cmxcIixcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLnVzZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UodXNlcikucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZShudWxsLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJzID0gdXNlclNlcnZpY2UuZ2V0KHtwYWdlOiB2bS51c2Vycy5wYWdlLm51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpemU6IHZtLnVzZXJzLnBhZ2Uuc2l6ZX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNhdmVVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IEhhdGVvYXNJbnRlcmZhY2UodXNlcikucmVzb3VyY2UoXCJzZWxmXCIpLnNhdmUodXNlcikuJHByb21pc2U7XHJcbiAgICB9O1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwiSGF0ZW9hc0ludGVyZmFjZVwiLCBcInVzZXJTZXJ2aWNlXCIsIFwidXNlclJvbGVTZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnVzZXJzXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvYWRtaW4vdXNlci9saXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImxpc3RVc2VyQWRtaW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcInVzZXJzQ3RybFwiLFxyXG4gICAgICAgIHVybDogXCJ1c2Vyc1wiXHJcbiAgICB9KTtcclxufTtcclxuY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcbiIsInZhciBjb25maWcgPSByZXF1aXJlKFwiLi91c2VyLmNvbmZpZ1wiKTtcclxudmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgYWRkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FkZC5jb250cm9sbGVyXCIpO1xyXG52YXIgdXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbnZhciB1c2VyUm9sZVNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2Vycm9sZS5zZXJ2aWNlXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4uYWRtaW4udXNlcicsIFtdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwibGlzdFVzZXJBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRVc2VyQWRtaW5Db250cm9sbGVyXCIsIGFkZENvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJ1c2VyU2VydmljZVwiLCB1c2VyU2VydmljZSlcclxuICAgICAgICAuc2VydmljZShcInVzZXJSb2xlU2VydmljZVwiLCB1c2VyUm9sZVNlcnZpY2UpO1xyXG4iLCJ2YXIgdXNlclNlcnZpY2UgPSBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4gJHJlc291cmNlKFwiL2FwaS91c2VyXCIpO1xyXG59O1xyXG51c2VyU2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJTZXJ2aWNlO1xyXG4iLCJ2YXIgdXNlclJvbGVTZXJ2aWNlID0gZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZShcIi9hcGkvcm9sZVwiKTtcclxufTtcclxudXNlclJvbGVTZXJ2aWNlLiRpbmplY3QgPSBbXCIkcmVzb3VyY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdXNlclJvbGVTZXJ2aWNlO1xyXG4iLCJcclxuZnVuY3Rpb24gYXV0aFRva2VuSHR0cEludGVyY2VwdG9yKCRzZXNzaW9uU3RvcmFnZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBcInJlcXVlc3RcIjogZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgICAgICBpZiAoY29uZmlnLnVybCAmJiBjb25maWcudXJsLmluZGV4T2YoXCIuaHRtbFwiKSA9PT0gLTEgJiYgJHNlc3Npb25TdG9yYWdlLm9hdXRoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5hdXRob3JpemF0aW9uID0gJHNlc3Npb25TdG9yYWdlLm9hdXRoLnRva2VuX3R5cGUgKyBcIiBcIiArICRzZXNzaW9uU3RvcmFnZS5vYXV0aC5hY2Nlc3NfdG9rZW47XHJcbiAgICAgICAgICAgICAgICBjb25maWcud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuO1xyXG5hdXRoVG9rZW5IdHRwSW50ZXJjZXB0b3IuJGluamVjdCA9IFtcIiRzZXNzaW9uU3RvcmFnZVwiXTtcclxuXHJcbnZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICRodHRwUHJvdmlkZXIsIEhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcFwiLCB7XHJcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwibGF5b3V0LWFwcC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJhcHBDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImFwcEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgY3VycmVudHVzZXI6IFtcImN1cnJlbnRVc2VyU2VydmljZVwiLCBmdW5jdGlvbiAoY3VycmVudFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyU2VydmljZS5nZXQoKTtcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBhcHBQYXJhbWV0ZXJzIDogWyBcInBhcmFtZXRlclNlcnZpY2VcIiwgZnVuY3Rpb24gKHBhcmFtZXRlclNlcnZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1ldGVyU2VydmljZS5xdWVyeSgpO1xyXG4gICAgICAgICAgICB9XVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAuZGFzaGJvYXJkXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJkYXNoYm9hcmRDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImRhc2hib2FyZEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiZGFzaGJvYXJkXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvZmlsXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvZmlsL3Byb2ZpbC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJwcm9maWxDb250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcInByb2ZpbEN0cmxcIixcclxuICAgICAgICB1cmw6IFwicHJvZmlsXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJsb2dpblwiLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwibG9naW4uaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgY29udHJvbGxlckFzOiBcImxvZ2luXCIsXHJcbiAgICAgICAgdXJsOiBcIi9sb2dpblwiXHJcbiAgICB9KTtcclxuICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goYXV0aFRva2VuSHR0cEludGVyY2VwdG9yKTtcclxuICAgIEhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyLnRyYW5zZm9ybUFsbFJlc3BvbnNlcygpO1xyXG59O1xyXG5jb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJGh0dHBQcm92aWRlclwiLCBcIkhhdGVvYXNJbnRlcmNlcHRvclByb3ZpZGVyXCJdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XHJcblxyXG4iLCJ2YXIgYXBwQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkaHR0cCwgY3VycmVudHVzZXIsIHNjb3BlLCAkc2Vzc2lvblN0b3JhZ2UsICRzdGF0ZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLmN1cnJlbnR1c2VyID0gY3VycmVudHVzZXI7XHJcbiAgICBjdXJyZW50dXNlci4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjdXJyZW50dXNlci5wcm9qZWN0cyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwicHJvamVjdFwiKS5xdWVyeSgpO1xyXG4gICAgICAgIGlmIChjdXJyZW50dXNlci5fbGlua3MucGhvdG8pIHtcclxuICAgICAgICAgICAgJGh0dHAuZ2V0KGN1cnJlbnR1c2VyLl9saW5rcy5waG90bykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50dXNlci5waG90byA9IHJlc3VsdC5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgO1xyXG4gICAgfSk7XHJcbiAgICB2bS5yZWRpcmVjdFRhc2sgPSBmdW5jdGlvbiAoJGl0ZW0sICRtb2RlbCwgJGxhYmVsKSB7XHJcbiAgICAgICAgcHJvamVjdCA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwicHJvamVjdFwiKS5xdWVyeSh7dGFza0lkOiAkbW9kZWwuaWR9KS4kcHJvbWlzZTtcclxuICAgICAgICBwcm9qZWN0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc3RhdGUudHJhbnNpdGlvblRvKFwiYXBwLnByb2plY3QudGFza1wiLCAoe3Byb2plY3RJZDogcHJvamVjdC4kJHN0YXRlLnZhbHVlWzBdLmlkLCB0YXNrSWQ6ICRtb2RlbC5pZH0pKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2bS5zZWFyY2hlZFRhc2sgPSAnJztcclxuICAgIH07XHJcbiAgICB2bS5nZXRUYXNrcyA9IGZ1bmN0aW9uICh0ZXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnR1c2VyLnJlc291cmNlKFwic2VhcmNoXCIpLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5saWJlbGxlUmVzZWFyY2ggPSBmdW5jdGlvbih0YXNrKXtcclxuICAgICAgICB2YXIgbGliZWxsZSA9ICcnO1xyXG4gICAgICAgIGlmKHRhc2sgIT09IHVuZGVmaW5lZCAmJiB0YXNrICE9PSAnJyl7XHJcbiAgICAgICAgICAgIGxpYmVsbGUgPSAnIycgKyB0YXNrLmlkICsgJyAtICcgKyB0YXNrLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaWJlbGxlO1xyXG4gICAgfVxyXG4gICAgdm0ubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRlbGV0ZSAkc2Vzc2lvblN0b3JhZ2Uub2F1dGg7XHJcbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImxvZ2luXCIpO1xyXG4gICAgfTtcclxuICAgIHNjb3BlLiRvbihcImthbmJhbjpwcm9qZWN0cy11cGRhdGVzXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjdXJyZW50dXNlci5wcm9qZWN0cyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwicHJvamVjdFwiKS5xdWVyeSgpO1xyXG4gICAgfSk7XHJcbn07XHJcbmFwcENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRodHRwXCIsIFwiY3VycmVudHVzZXJcIiwgXCIkc2NvcGVcIiwgXCIkc2Vzc2lvblN0b3JhZ2VcIiwgXCIkc3RhdGVcIl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcENvbnRyb2xsZXI7XHJcbiIsIlxyXG52YXIgYXBwQ29uZmlnID0gcmVxdWlyZShcIi4vYXBwLmNvbmZpZ1wiKTtcclxudmFyIGFwcFJ1biA9IHJlcXVpcmUoXCIuL2FwcC5ydW5cIik7XHJcbnZhciBsb2dpbk1vZHVsZSA9IHJlcXVpcmUoXCIuL2xvZ2luL2xvZ2luLm1vZHVsZVwiKTtcclxudmFyIGFwcENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hcHAuY29udHJvbGxlclwiKTtcclxudmFyIGRhc2hib2FyZE1vZHVsZSA9IHJlcXVpcmUoXCIuL2Rhc2hib2FyZC9kYXNoYm9hcmQubW9kdWxlXCIpO1xyXG52YXIgcHJvamVjdE1vZHVsZSA9IHJlcXVpcmUoXCIuL3Byb2plY3QvcHJvamVjdC5tb2R1bGVcIik7XHJcbnZhciBzYW1lUGFzc3dvcmREaXJlY3RpdmUgPSByZXF1aXJlKFwiLi9kaXJlY3RpdmUvc2FtZVBhc3N3b3JkLmRpcmVjdGl2ZVwiKTtcclxudmFyIGNoZWNrYm94RmlsdGVyRGlyZWN0aXZlID0gcmVxdWlyZShcIi4vZGlyZWN0aXZlL2NoZWNrYm94ZmlsdGVyLmRpcmVjdGl2ZVwiKTtcclxudmFyIGVycm9yRGlyZWN0aXZlID0gcmVxdWlyZShcIi4vZGlyZWN0aXZlL2Vycm9yLmRpcmVjdGl2ZVwiKTtcclxudmFyIHRvZ2dsZXJEaXJlY3RpdmUgPSByZXF1aXJlKFwiLi9kaXJlY3RpdmUvdG9nZ2xlci5kaXJlY3RpdmVcIik7XHJcbnZhciBhZG1pbk1vZHVsZSA9IHJlcXVpcmUoXCIuL2FkbWluL2FkbWluLm1vZHVsZVwiKTtcclxudmFyIHByb2ZpbENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9wcm9maWwvcHJvZmlsLmNvbnRyb2xsZXJcIik7XHJcbnZhciBwYXJhbWV0ZXJNb2R1bGUgPSByZXF1aXJlKFwiLi9wYXJhbWV0ZXIvcGFyYW1ldGVyLm1vZHVsZVwiKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwia2FuYmFuXCIsXHJcbiAgICAgICAgW1widWkucm91dGVyXCIsIFwibmdTdG9yYWdlXCIsIFwibmdTYW5pdGl6ZVwiLCBcInVpLnNvcnRhYmxlXCIsIFwiYW5ndWxhck1vbWVudFwiLFxyXG4gICAgICAgICAgICBcImh0dHAtYXV0aC1pbnRlcmNlcHRvclwiLCBcInhlZGl0YWJsZVwiLCBcIm5nUmVzb3VyY2VcIixcclxuICAgICAgICAgICAgXCJoYXRlb2FzXCIsIFwidWkuYm9vdHN0cmFwXCIsIFwidWkuYm9vdHN0cmFwLnRwbHNcIiwgXCJuZ0ltZ0Nyb3BcIiwgXCJ0ZXh0QW5ndWxhclwiLCBcImluZmluaXRlLXNjcm9sbFwiLFxyXG4gICAgICAgICAgICBsb2dpbk1vZHVsZS5uYW1lLCBkYXNoYm9hcmRNb2R1bGUubmFtZSxcclxuICAgICAgICAgICAgcHJvamVjdE1vZHVsZS5uYW1lLCBhZG1pbk1vZHVsZS5uYW1lLCBwYXJhbWV0ZXJNb2R1bGUubmFtZV0pXHJcbiAgICAgICAgLmNvbmZpZyhhcHBDb25maWcpXHJcbiAgICAgICAgLnJ1bihhcHBSdW4pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhcHBDb250cm9sbGVyXCIsIGFwcENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJwcm9maWxDb250cm9sbGVyXCIsIHByb2ZpbENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmRpcmVjdGl2ZShcImNoZWNrYm94RmlsdGVyXCIsIGNoZWNrYm94RmlsdGVyRGlyZWN0aXZlKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoXCJzYW1lUGFzc3dvcmRcIiwgc2FtZVBhc3N3b3JkRGlyZWN0aXZlKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoXCJlcnJvcnNcIiwgZXJyb3JEaXJlY3RpdmUpXHJcbiAgICAgICAgLmRpcmVjdGl2ZShcInRvZ2dsZXJcIiwgdG9nZ2xlckRpcmVjdGl2ZSk7XHJcblxyXG4iLCIvKiBcclxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxyXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcclxuICogYW5kIG9wZW4gdGhlIHRlbXBsYXRlIGluIHRoZSBlZGl0b3IuXHJcbiAqL1xyXG5cclxudmFyIGFwcFJ1biA9IGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2Vzc2lvblN0b3JhZ2UsICRzdGF0ZSwgJHVpYk1vZGFsLCBhdXRoU2VydmljZSwgZWRpdGFibGVPcHRpb25zKSB7XHJcbiAgICBlZGl0YWJsZU9wdGlvbnMudGhlbWUgPSAnYnMzJztcclxuICAgICRyb290U2NvcGUubG9naW5PbmdvaW5nID0gZmFsc2U7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihcImV2ZW50OmF1dGgtZm9yYmlkZGVuXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc3RhdGUuZ28oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgfSk7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihcImV2ZW50OmF1dGgtbG9naW5SZXF1aXJlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZGVsZXRlICRzZXNzaW9uU3RvcmFnZS5vYXV0aDtcclxuICAgICAgICB2YXIgbW9kYWxTY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgIGlmICghJHJvb3RTY29wZS5sb2dpbk9uZ29pbmcpIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5sb2dpbk9uZ29pbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBiYWNrZHJvcDogXCJzdGF0aWNcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwibG9naW5cIixcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBtb2RhbFNjb3BlLFxyXG4gICAgICAgICAgICAgICAga2V5Ym9hcmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtb2RhbFNjb3BlLm1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbkNvbmZpcm1lZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmxvZ2luT25nb2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICRzdGF0ZS5nbyhcImxvZ2luXCIpO1xyXG59O1xyXG5hcHBSdW4uJGluamVjdCA9IFtcIiRyb290U2NvcGVcIiwgXCIkc2Vzc2lvblN0b3JhZ2VcIiwgXCIkc3RhdGVcIiwgXCIkdWliTW9kYWxcIiwgXCJhdXRoU2VydmljZVwiLCBcImVkaXRhYmxlT3B0aW9uc1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhcHBSdW47XHJcblxyXG5cclxuIiwidmFyIGFkZENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsSW5zdGFuY2UsYWxsb2NhdGlvblNlcnZpY2UsIGRheSwgY3VycmVudHVzZXIsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5kYXkgPSBkYXk7XHJcbiAgICB2bS5hbGxvY2F0aW9ucyA9IGFsbG9jYXRpb25TZXJ2aWNlLmxvYWRBbGxvY2F0aW9uKGFwcFBhcmFtZXRlcnMpO1xyXG4gICAgLy8gbmVlZCB0byBtdWx0aXB5IGJ5IDEwMDAgZm9yIGdldCBVTklYIFRpbWVzdGFtcFxyXG4gICAgdm0uaW1wdXRhdGlvbnMgPSBjdXJyZW50dXNlci5yZXNvdXJjZShcImNvbnNvbW1hdGlvblwiKS5xdWVyeSh7ZGF0ZTogZGF5LmZvcm1hdChcIlhcIikgKiAxMDAwfSk7XHJcbiAgICB2bS5hZGRUYXNrID0gZnVuY3Rpb24gKCRpdGVtLCAkbW9kZWwsICRsYWJlbCkge1xyXG4gICAgICAgIHZhciBuZXdJbXB1dGF0aW9uID0ge1xyXG4gICAgICAgICAgICB0YXNrTmFtZTogJG1vZGVsLm5hbWUsXHJcbiAgICAgICAgICAgIHRhc2tJZDogJG1vZGVsLmlkLFxyXG4gICAgICAgICAgICB0aW1lUmVtYWluczogJG1vZGVsLnRpbWVSZW1haW5zLFxyXG4gICAgICAgICAgICB0aW1lU3BlbnQ6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0YXNrQWxyZWFkeUFkZGVkID0gZmFsc2U7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHZtLmltcHV0YXRpb25zLCBmdW5jdGlvbiAoaW1wdXRhdGlvbikge1xyXG4gICAgICAgICAgICBpZiAobmV3SW1wdXRhdGlvbi50YXNrSWQgPT09IGltcHV0YXRpb24udGFza0lkKSB7XHJcbiAgICAgICAgICAgICAgICB0YXNrQWxyZWFkeUFkZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghdGFza0FscmVhZHlBZGRlZCkge1xyXG4gICAgICAgICAgICB2bS5pbXB1dGF0aW9ucy5wdXNoKG5ld0ltcHV0YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2bS5hZGRlZFRhc2sgPSBudWxsO1xyXG4gICAgfTtcclxuICAgIHZtLmdldFRhc2tzID0gZnVuY3Rpb24gKHRlcm0pIHtcclxuICAgICAgICByZXR1cm4gY3VycmVudHVzZXIucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gbmVlZCB0byBtdWx0aXB5IGJ5IDEwMDAgZm9yIGdldCBVTklYIFRpbWVzdGFtcFxyXG4gICAgICAgIGN1cnJlbnR1c2VyLnJlc291cmNlKFwiY29uc29tbWF0aW9uXCIpLnNhdmUoe2RhdGU6IGRheS5mb3JtYXQoXCJYXCIpICogMTAwMH0sIHZtLmltcHV0YXRpb25zLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsXCJhbGxvY2F0aW9uU2VydmljZVwiLCBcImRheVwiLCBcImN1cnJlbnR1c2VyXCIsIFwiYXBwUGFyYW1ldGVyc1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyOyIsIlxyXG52YXIgZGFzaGJvYXJkQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIEhhdGVvYXNJbnRlcmZhY2UsIGN1cnJlbnR1c2VyLCB0YXNrQXNzZW1ibGVyU2VydmljZSwgdWlDYWxlbmRhckNvbmZpZywgbW9tZW50LCBhcHBQYXJhbWV0ZXJzKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0udGFza3MgPSB7XHJcbiAgICAgICAgcGFnZToge1xyXG4gICAgICAgICAgICBzaXplOiAxMCxcclxuICAgICAgICAgICAgbnVtYmVyOiAxXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN1cnJlbnR1c2VyLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS50YXNrcyA9IGN1cnJlbnR1c2VyLnJlc291cmNlKFwidGFza1wiKS5nZXQoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiB2bS50YXNrcy5wYWdlLm51bWJlciAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHZtLnRhc2tzLnBhZ2Uuc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5fZW1iZWRkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YS5fZW1iZWRkZWQudGFza1Jlc291cmNlTGlzdCwgZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRhc2tBc3NlbWJsZXJTZXJ2aWNlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnByb2plY3QgPSBuZXcgSGF0ZW9hc0ludGVyZmFjZSh0YXNrKS5yZXNvdXJjZShcInByb2plY3RcIikuZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRhLnBhZ2UubnVtYmVyKys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZtLmNhbGVuZGFyT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogNDUwLFxyXG4gICAgICAgICAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGFuZzogXCJmclwiLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogJ3RpdGxlJyxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAndG9kYXkgcHJldixuZXh0J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHZpZXdSZW5kZXI6IGZ1bmN0aW9uICh2aWV3LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbW9tZW50KHZpZXcuc3RhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSBtb21lbnQodmlldy5lbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5lZWQgdG8gbXVsdGlweSBieSAxMDAwIGZvciBnZXQgVU5JWCBUaW1lc3RhbXBcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkQ2FsZW5kYXJFdmVudChzdGFydC5mb3JtYXQoXCJYXCIpICogMTAwMCwgZW5kLmZvcm1hdChcIlhcIikgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXlDbGljazogZGF5T25DbGlja1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmxvYWRDYWxlbmRhckV2ZW50ID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcclxuICAgICAgICBjdXJyZW50dXNlci5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoe3N0YXJ0OiBzdGFydCwgZW5kOiBlbmR9LFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA9IHRhc2tBc3NlbWJsZXJTZXJ2aWNlKHRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnRpdGxlID0gdGFzay5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrLnN0YXJ0ID0gbW9tZW50KHRhc2sucGxhbm5lZFN0YXJ0KS50b0RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5lbmQgPSBtb21lbnQodGFzay5wbGFubmVkRW5kaW5nKS50b0RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5hbGxEYXkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5fbGlua3MuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suY2F0ZWdvcnkuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5iYWNrZ3JvdW5kQ29sb3IgPSB0YXNrLmNhdGVnb3J5LmJnY29sb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlDYWxlbmRhckNvbmZpZy5jYWxlbmRhcnMudXNlckNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyRXZlbnQnLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlDYWxlbmRhckNvbmZpZy5jYWxlbmRhcnMudXNlckNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyRXZlbnQnLCB0YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgY3VycmVudHVzZXIuJHByb21pc2UudGhlbihsb2FkKTtcclxuICAgIGRheU9uQ2xpY2sgPSBmdW5jdGlvbiAoZGF5KSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2Rhc2hib2FyZC9jYWxlbmRhci9pbXB1dGF0aW9uLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRJbXB1dGF0aW9uQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkSW1wdXRhdGlvbkN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgZGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50dXNlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50dXNlcjtcclxuICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgYXBwUGFyYW1ldGVycyA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBQYXJhbWV0ZXJzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGxvYWQpO1xyXG4gICAgfTtcclxuICAgIHZtLmV2ZW50c1NvdXJjZSA9IFtdO1xyXG59O1xyXG5kYXNoYm9hcmRDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCJIYXRlb2FzSW50ZXJmYWNlXCIsIFwiY3VycmVudHVzZXJcIiwgXCJ0YXNrQXNzZW1ibGVyU2VydmljZVwiLCBcInVpQ2FsZW5kYXJDb25maWdcIiwgXCJtb21lbnRcIiwgXCJhcHBQYXJhbWV0ZXJzXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGRhc2hib2FyZENvbnRyb2xsZXI7XHJcbiIsInZhciBkYXNoYm9hcmRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vZGFzaGJvYXJkLmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRJbXB1dGF0aW9uQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2NhbGVuZGFyL2FkZGltcHV0YXRpb24uY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLmRhc2hib2FyZCcsIFtcInVpLmNhbGVuZGFyXCJdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiZGFzaGJvYXJkQ29udHJvbGxlclwiLCBkYXNoYm9hcmRDb250cm9sbGVyKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiYWRkSW1wdXRhdGlvbkNvbnRyb2xsZXJcIiwgYWRkSW1wdXRhdGlvbkNvbnRyb2xsZXIpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICBzY29wZToge2ZpbHRlclRpdGxlOiAnQCd9LFxyXG4gICAgICAgIHRlbXBsYXRlOiAgICc8ZGl2IGNsYXNzPVwiY2hlY2tib3hEcm9wZG93blwiPidcclxuICAgICAgICAgICAgICAgICAgICArJzxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtXCIgbmctY2xpY2s9XCJ0b2dnbGUoKVwiPiB7e2ZpbHRlclRpdGxlfX0gPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj48L2J1dHRvbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwiY2hlY2tib3hEcm9wZG93bl9fZmlsdGVyc1wiIG5nLWNsYXNzPVwie1xcJ2NoZWNrYm94RHJvcGRvd25fX2ZpbHRlcnMtLXNob3dcXCc6IHRvZ2dsZWR9XCI+PG5nLXRyYW5zY2x1ZGU+PC9uZy10cmFuc2NsdWRlPjwvZGl2PidcclxuICAgICAgICAgICAgICAgICAgICArJzwvZGl2PicsXHJcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRycykge1xyXG4gICAgICAgICAgICBzY29wZS50b2dnbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNjb3BlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnRvZ2dsZWQgPSAhc2NvcGUudG9nZ2xlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBlcnJvcnM6IFwiPWVycm9yc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZW1wbGF0ZTogJzx1bD4gJ1xyXG4gICAgICAgICAgICAgICAgKyAnPGxpIG5nLXJlcGVhdD1cIm1zZyBpbiBlcnJvcnMubWVzc2FnZXNcIj4nXHJcbiAgICAgICAgICAgICAgICArICd7e21zZy5tZXNzYWdlfX0nXHJcbiAgICAgICAgICAgICAgICArICc8L2xpPidcclxuICAgICAgICAgICAgICAgICsgJzwvdWw+J1xyXG4gICAgfTtcclxufTtcclxuIiwiXHJcbnZhciBjaGVja1NhbWVQYXNzd29yZCA9IGZ1bmN0aW9uIChwYXNzd29yZCwgcmVQYXNzd29yZCkge1xyXG4gICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgIGlmIChyZVBhc3N3b3JkICE9PSAnJyAmJlxyXG4gICAgICAgICAgICBwYXNzd29yZCAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICYmIHJlUGFzc3dvcmQgIT09IHBhc3N3b3JkKSB7XHJcbiAgICAgICAgZXJyb3IgPSB7fTtcclxuICAgICAgICBlcnJvci5tZXNzYWdlcyA9IFtcclxuICAgICAgICAgICAge21lc3NhZ2U6IFwiTGVzIG1vdHMgZGUgcGFzc2Ugc2Fpc2lzIG5lIGNvcnJlc3BvbmRlbnQgcGFzXCJ9XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHJldHVybiBlcnJvcjtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHJlc3RyaWN0OiBcIkVcIixcclxuICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBcIj1wYXNzd29yZFwiLFxyXG4gICAgICAgICAgICBlcnJvcjogXCI9ZXJyb3JcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMsIGN0cmwpIHtcclxuICAgICAgICAgICAgdmFyIHJlUGFzc3dvcmRFbG0gPSBlbGVtLmNoaWxkcmVuKClbMF07XHJcbiAgICAgICAgICAgIGVsZW0uYWRkKHNjb3BlLnBhc3N3b3JkKS5vbigna2V5dXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5lcnJvciA9IGNoZWNrU2FtZVBhc3N3b3JkKHNjb3BlLnBhc3N3b3JkLCByZVBhc3N3b3JkRWxtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCdwYXNzd29yZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZVBhc3N3b3JkRWxtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuZXJyb3IgPSBjaGVja1NhbWVQYXNzd29yZChzY29wZS5wYXNzd29yZCwgcmVQYXNzd29yZEVsbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGVtcGxhdGU6IGZ1bmN0aW9uKGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciBodG1sVGV4dCA9ICc8aW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgJztcclxuICAgICAgICAgICAgdmFyIHJlcXVpcmVkID0gYXR0cnMucmVxdWlyZWQ7XHJcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlciA9IGF0dHJzLnBsYWNlaG9sZGVyO1xyXG4gICAgICAgICAgICBpZihyZXF1aXJlZCA9PT0gXCJyZXF1aXJlZFwiKXtcclxuICAgICAgICAgICAgICAgIGh0bWxUZXh0ICs9ICdyZXF1aXJlZD1cInJlcXVpcmVkXCIgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBodG1sVGV4dCArPSAnY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBpZCA9IFwicmVQYXNzd29yZFwiIHBsYWNlaG9sZGVyID0gXCInICsgcGxhY2Vob2xkZXIrICdcIiAvID4gJztcclxuICAgICAgICAgICAgcmV0dXJuIGh0bWxUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07IiwiXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJBXCIsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgdG9nZ2xlQ2xhc3M6ICdAJyxcclxuICAgICAgICAgICAgdG9nZ2xlQWN0aXZlOiAnPSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSkge1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUudG9nZ2xlQWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZWxlbSkub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhzY29wZS50b2dnbGVDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07IiwiLyogXHJcbiAqIFRvIGNoYW5nZSB0aGlzIGxpY2Vuc2UgaGVhZGVyLCBjaG9vc2UgTGljZW5zZSBIZWFkZXJzIGluIFByb2plY3QgUHJvcGVydGllcy5cclxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXHJcbiAqIGFuZCBvcGVuIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgZWRpdG9yLlxyXG4gKi9cclxudmFyIGFwcEF1dGhTZXJ2aWNlID0gZnVuY3Rpb24gYXBwQXV0aFNlcnZpY2UoJGh0dHApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9naW46IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xyXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogXCIvb2F1dGgvdG9rZW5cIixcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uOiBcIkJhc2ljIFwiICsgYnRvYShcImNsaWVudGFwcDoxMjM0NTZcIilcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogY3JlZGVudGlhbHMudXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6IFwicGFzc3dvcmRcIixcclxuICAgICAgICAgICAgICAgICAgICBzY29wZTogXCJyZWFkIHdyaXRlXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKGNvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuYXBwQXV0aFNlcnZpY2UuJGluamVjdCA9IFtcIiRodHRwXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFwcEF1dGhTZXJ2aWNlOyIsInZhciB1c2VyUHJvZmlsZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3VzZXJQcm9maWxlXCIpO1xyXG59O1xyXG51c2VyUHJvZmlsZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXJQcm9maWxlO1xyXG4iLCJ2YXIgbG9naW5Db250cm9sbGVyID0gZnVuY3Rpb24gKHNjb3BlLCAkc3RhdGUsICRzZXNzaW9uU3RvcmFnZSwgYXBwQXV0aFNlcnZpY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5hdXRoZW50aWNhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYXBwQXV0aFNlcnZpY2UubG9naW4odm0ubG9naW5Gb3JtKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgJHNlc3Npb25TdG9yYWdlLm9hdXRoID0gcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUubW9kYWxJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUubW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0ubG9naW5Gb3JtID0ge307XHJcbiAgICAgICAgICAgIHZtLmxvZ2luRm9ybS5lcnJvciA9IFwiTG9naW4vcGFzc3dvcmQgaW52YWxpZGVcIjtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmxvZ2luQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJHNlc3Npb25TdG9yYWdlXCIsIFwiYXBwQXV0aFNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gbG9naW5Db250cm9sbGVyOyIsInZhciBsb2dpbkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9sb2dpbi5jb250cm9sbGVyXCIpO1xyXG52YXIgYXBwQXV0aFNlcnZpY2UgPSByZXF1aXJlKFwiLi9hdXRoLnNlcnZpY2VcIik7XHJcbnZhciBjdXJyZW50VXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi9jdXJyZW50dXNlci5zZXJ2aWNlXCIpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdrYW5iYW4ubG9naW4nLCBbXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImxvZ2luQ29udHJvbGxlclwiLCBsb2dpbkNvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJhcHBBdXRoU2VydmljZVwiLCBhcHBBdXRoU2VydmljZSlcclxuICAgICAgICAuc2VydmljZShcImN1cnJlbnRVc2VyU2VydmljZVwiLCBjdXJyZW50VXNlclNlcnZpY2UpO1xyXG4iLCJ2YXIgYWxsb2NhdGlvblNlcnZpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvYWRBbGxvY2F0aW9uOiBmdW5jdGlvbiAoYXBwUGFyYW1ldGVycykge1xyXG4gICAgICAgICAgICB2YXIgYWxsb2NhdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcHBQYXJhbWV0ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXBwUGFyYW1ldGVyc1tpXS5jYXRlZ29yeSA9PT0gJ0FMTE9DQVRJT04nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcHBQYXJhbWV0ZXJzW2ldLnBhcmFtZXRlci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxvY2F0aW9uc1thcHBQYXJhbWV0ZXJzW2ldLnBhcmFtZXRlcltqXS5rZXlQYXJhbV0gPSBhcHBQYXJhbWV0ZXJzW2ldLnBhcmFtZXRlcltqXS52YWx1ZVBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYWxsb2NhdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuYWxsb2NhdGlvblNlcnZpY2UuJGluamVjdCA9IFtdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGFsbG9jYXRpb25TZXJ2aWNlO1xyXG4iLCJcclxudmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcGFyYW1ldGVyU2VydmljZSkge1xyXG4gICAgdmFyIHZtID0gdGhpcztcclxuICAgIHZtLnNhdmVQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocGFyYW1ldGVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHBhcmFtZXRlclNlcnZpY2Uuc2F2ZShwYXJhbWV0ZXIpLiRwcm9taXNlO1xyXG4gICAgICAgIHJlc3VsdC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgZXJyb3IuZGF0YSA9IGVycm9yLmRhdGEubWVzc2FnZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5wYXJhbWV0ZXJzID0gcGFyYW1ldGVyU2VydmljZS5xdWVyeSgpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbG9hZCgpO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwicGFyYW1ldGVyU2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q29udHJvbGxlcjtcclxuXHJcbiIsInZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnBhcmFtZXRlclwiLCB7XHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2FkbWluL3BhcmFtZXRlci9saXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImxpc3RQYXJhbWV0ZXJBZG1pbkNvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwicGFyYW1ldGVyQ3RybFwiLFxyXG4gICAgICAgIHVybDogXCJwYXJhbWV0ZXJcIlxyXG4gICAgfSk7XHJcbn07XHJcbmNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG4iLCJ2YXIgY29uZmlnID0gcmVxdWlyZShcIi4vcGFyYW1ldGVyLmNvbmZpZ1wiKTtcclxudmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgcGFyYW1ldGVyU2VydmljZSA9IHJlcXVpcmUoXCIuL3BhcmFtZXRlci5zZXJ2aWNlXCIpO1xyXG52YXIgYWxsb2NhdGlvblNlcnZpY2UgPSByZXF1aXJlKFwiLi9hbGxvY2F0aW9uLnNlcnZpY2VcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5wYXJhbWV0ZXInLCBbXSlcclxuICAgICAgICAuY29uZmlnKGNvbmZpZylcclxuICAgICAgICAuY29udHJvbGxlcihcImxpc3RQYXJhbWV0ZXJBZG1pbkNvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJwYXJhbWV0ZXJTZXJ2aWNlXCIsIHBhcmFtZXRlclNlcnZpY2UpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJhbGxvY2F0aW9uU2VydmljZVwiLCBhbGxvY2F0aW9uU2VydmljZSk7IiwidmFyIHBhcmFtZXRlclNlcnZpY2UgPSBmdW5jdGlvbiAoJHJlc291cmNlKSB7XHJcbiAgICByZXR1cm4gJHJlc291cmNlKFwiL2FwaS9wYXJhbWV0ZXIvOmNhdGVnb3J5LzprZXlcIiwge2NhdGVnb3J5OiBcIkBjYXRlZ29yeVwiLCBrZXk6IFwiQGtleVBhcmFtXCJ9KTtcclxufTtcclxucGFyYW1ldGVyU2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHBhcmFtZXRlclNlcnZpY2U7XHJcbiIsInZhciBwcm9maWxDb250cm9sbGVyID0gZnVuY3Rpb24gKHNjb3BlLCAkaHR0cCwgY3VycmVudHVzZXIpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5uZXdQaG90byA9ICcnO1xyXG4gICAgY3VycmVudHVzZXIuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0ucHJvZmlsID0gY3VycmVudHVzZXI7XHJcbiAgICAgICAgaWYgKGN1cnJlbnR1c2VyLl9saW5rcy5tZW1iZXIpIHtcclxuICAgICAgICAgICAgdm0ucHJvZmlsLm1lbWJlcnMgPSBjdXJyZW50dXNlci5yZXNvdXJjZShcIm1lbWJlclwiKS5xdWVyeSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdmFyIGhhbmRsZUZpbGVTZWxlY3QgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgdmFyIGZpbGUgPSBldnQuY3VycmVudFRhcmdldC5maWxlc1swXTtcclxuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdm0ucGhvdG9UZW1wID0gZXZ0LnRhcmdldC5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9O1xyXG4gICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwaG90b1Byb2ZpbCcpKS5vbignY2hhbmdlJywgaGFuZGxlRmlsZVNlbGVjdCk7XHJcbiAgICB2bS5zYXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdm0uZXJyb3IpIHtcclxuICAgICAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImlkXCIsIHZtLnByb2ZpbC5pZCk7XHJcbiAgICAgICAgICAgIGlmICh2bS5wcm9maWwucGFzc3dvcmQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicGFzc3dvcmRcIiwgdm0ucHJvZmlsLnBhc3N3b3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJlbWFpbFwiLCB2bS5wcm9maWwuZW1haWwpO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwaG90b1wiLCB2bS5uZXdQaG90byk7XHJcbiAgICAgICAgICAgICRodHRwKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGN1cnJlbnR1c2VyLl9saW5rcy5zZWxmLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZH0sXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1SZXF1ZXN0OiBhbmd1bGFyLmlkZW50aXR5XHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50dXNlci5waG90byA9IHZtLm5ld1Bob3RvO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5wcm9maWxDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkaHR0cFwiLCBcImN1cnJlbnR1c2VyXCJdO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwcm9maWxDb250cm9sbGVyOyIsInZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QuY29uc29tbWF0aW9uXCIsIHtcclxuICAgICAgICBjb250cm9sbGVyOiBcImNvbnNvbW1hdGlvbkNvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwiY29uc29tbWF0aW9uQ3RybFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L2NvbnNvbW1hdGlvbi9tZW1iZXIuaHRtbFwiLFxyXG4gICAgICAgIHVybDogXCJjb25zb21tYXRpb25cIlxyXG4gICAgfSk7XHJcbn07XHJcbmNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG4iLCJmdW5jdGlvbiBnZXRXZWVrRGF5cyhtb21lbnQsIHN0YXJ0KSB7XHJcbiAgICB2YXIgZGF5cyA9IFtdO1xyXG4gICAgdmFyIGRheSA9IG1vbWVudChzdGFydCk7XHJcbiAgICAvL09uIG4nYWZmaWNoZSBxdWUgbGVzIGpvdXJzIG91dmVydHNcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKSB7XHJcbiAgICAgICAgZGF5cy5wdXNoKGRheSk7XHJcbiAgICAgICAgZGF5ID0gbW9tZW50KGRheSkuYWRkKDEsICdkYXlzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF5cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9udGhEYXlzKG1vbWVudCwgc3RhcnQsIG1vbnRoKSB7XHJcbiAgICB2YXIgZGF5cyA9IFtdO1xyXG4gICAgdmFyIGRheSA9IG1vbWVudChzdGFydCk7XHJcbiAgICB3aGlsZSAoZGF5Lm1vbnRoKCkgPT09IG1vbnRoKSB7XHJcbiAgICAgICAgLy9PbiBuJ2FmZmljaGUgcXVlIGxlcyBqb3VycyBvdXZlcnRzXHJcbiAgICAgICAgZGF5cy5wdXNoKGRheSk7XHJcbiAgICAgICAgZGF5ID0gbW9tZW50KGRheSkuYWRkKDEsICdkYXlzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF5cztcclxufVxyXG5cclxudmFyIGNvbnNvbWF0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uIChtb21lbnQsIHByb2plY3QsIGNvbnNvbWF0aW9uU2VydmljZSwgYWxsb2NhdGlvblNlcnZpY2UsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5wcmVjaXNpb24gPSBcIndlZWtcIjtcclxuICAgIHZtLnN0YXJ0ID0gbW9tZW50KCkuc3RhcnRPZignaXNvV2VlaycpO1xyXG4gICAgdm0uYWxsb2NhdGlvbnMgPSB7fTtcclxuICAgIHZhciBlbmQgPSBtb21lbnQodm0uc3RhcnQpO1xyXG4gICAgdm0uc2hvd0RldGFpbCA9IGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgIGVudHJ5LnNob3dEZXRhaWxzID0gdHJ1ZTtcclxuICAgIH07XHJcbiAgICB2bS5oaWRlRGV0YWlsID0gZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgZW50cnkuc2hvd0RldGFpbHMgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICB2bS5wcmVjaXNpb25DaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0uZGF5cyA9IFtdO1xyXG4gICAgICAgIGlmICh2bS5wcmVjaXNpb24gPT09IFwid2Vla1wiKSB7XHJcbiAgICAgICAgICAgIHZtLnN0YXJ0ID0gdm0uc3RhcnQuc3RhcnRPZignaXNvV2VlaycpO1xyXG4gICAgICAgICAgICB2bS5kYXlzID0gZ2V0V2Vla0RheXMobW9tZW50LCB2bS5zdGFydCk7XHJcbiAgICAgICAgICAgIGVuZCA9IG1vbWVudCh2bS5zdGFydCkuYWRkKDgsICdkYXlzJyk7XHJcbiAgICAgICAgICAgIHZtLmVudHJpZXMgPSBjb25zb21hdGlvblNlcnZpY2UubG9hZENvbnNvbW1hdGlvbnMocHJvamVjdCwgdm0uc3RhcnQsIGVuZCk7XHJcbiAgICAgICAgICAgIHZtLmVudHJpZXMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb21hdGlvblNlcnZpY2UuY2hlY2tNaXNzaW5nQnlEYXkodm0uZW50cmllcywgYXBwUGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLnN0YXJ0ID0gdm0uc3RhcnQuc3RhcnRPZignbW9udGgnKTtcclxuICAgICAgICAgICAgdm0uZGF5cyA9IGdldE1vbnRoRGF5cyhtb21lbnQsIHZtLnN0YXJ0LCB2bS5zdGFydC5tb250aCgpKTtcclxuICAgICAgICAgICAgZW5kID0gbW9tZW50KHZtLnN0YXJ0KS5hZGQoMSwgJ21vbnRocycpO1xyXG4gICAgICAgICAgICB2bS5lbnRyaWVzID0gY29uc29tYXRpb25TZXJ2aWNlLmxvYWRDb25zb21tYXRpb25zKHByb2plY3QsIHZtLnN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICAvL1RPRE8gUmVncm91cGUgcGFyIHNlbWFpbmUgdm0uZGF5cyBldCB2bS5lbnRyaWVzXHJcbiAgICAgICAgICAgIHZtLmVudHJpZXMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ3JvdXBlZCA9IGNvbnNvbWF0aW9uU2VydmljZS5ncm91cEJ5V2Vlayh2bS5lbnRyaWVzLCB2bS5kYXlzKTtcclxuICAgICAgICAgICAgICAgIHZtLmVudHJpZXMgPSBncm91cGVkLmVudHJpZXM7XHJcbiAgICAgICAgICAgICAgICB2bS5kYXlzID0gZ3JvdXBlZC53ZWVrcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnByZXZpb3VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh2bS5wcmVjaXNpb24gPT09IFwid2Vla1wiKSB7XHJcbiAgICAgICAgICAgIHZtLnN0YXJ0ID0gdm0uc3RhcnQuc3VidHJhY3QoNywgXCJkYXlzXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLnN0YXJ0ID0gdm0uc3RhcnQuc3VidHJhY3QoMSwgXCJtb250aHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZtLnByZWNpc2lvbkNoYW5nZSgpO1xyXG4gICAgfTtcclxuICAgIHZtLm5leHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHZtLnByZWNpc2lvbiA9PT0gXCJ3ZWVrXCIpIHtcclxuICAgICAgICAgICAgdm0uc3RhcnQgPSB2bS5zdGFydC5hZGQoNywgXCJkYXlzXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLnN0YXJ0ID0gdm0uc3RhcnQuYWRkKDEsIFwibW9udGhzXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2bS5wcmVjaXNpb25DaGFuZ2UoKTtcclxuICAgIH07XHJcbiAgICB2bS5jaGVja0FsbG9jYXRpb24gPSBmdW5jdGlvbiAoYWxsb2NhdGlvbikge1xyXG4gICAgICAgIHJldHVybiBhbGxvY2F0aW9uID09PSB2bS5tYXgudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgdm0ucHJlY2lzaW9uQ2hhbmdlKCk7XHJcbn07XHJcbmNvbnNvbWF0aW9uQ29udHJvbGxlci4kaW5qZWN0ID0gW1wibW9tZW50XCIsIFwicHJvamVjdFwiLCBcImNvbnNvbWF0aW9uU2VydmljZVwiLCBcImFsbG9jYXRpb25TZXJ2aWNlXCIsIFwiYXBwUGFyYW1ldGVyc1wiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25zb21hdGlvbkNvbnRyb2xsZXI7IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL2NvbnNvbW1hdGlvbi5jb25maWdcIik7XHJcbnZhciBjb25zb21tYXRpb25Db250cm9sbGVyID0gcmVxdWlyZShcIi4vY29uc29tbWF0aW9uLmNvbnRyb2xsZXJcIik7XHJcbnZhciBjb25zb1NlcnZpY2UgPSByZXF1aXJlKFwiLi9jb25zb21tYXRpb24uc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QuY29uc29tbWF0aW9uJywgW10pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJjb25zb21tYXRpb25Db250cm9sbGVyXCIsIGNvbnNvbW1hdGlvbkNvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJjb25zb21hdGlvblNlcnZpY2VcIiwgY29uc29TZXJ2aWNlKTsiLCJmdW5jdGlvbiBncm91cFdlZWtzKGRheXMpIHtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIHZhciB3ZWVrcyA9IFtdO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGN1cnJlbnRXZWVrO1xyXG4gICAgYW5ndWxhci5mb3JFYWNoKGRheXMsIGZ1bmN0aW9uIChkYXkpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnRXZWVrIHx8IGRheS53ZWVrKCkgIT09IGN1cnJlbnRXZWVrKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRXZWVrID0gZGF5LndlZWsoKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXdlZWtzW2ldKSB7XHJcbiAgICAgICAgICAgIHdlZWtzW2ldID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdlZWtzW2ldLnB1c2goZGF5KTtcclxuICAgIH0pO1xyXG4gICAgYW5ndWxhci5mb3JFYWNoKHdlZWtzLCBmdW5jdGlvbiAod2Vlaykge1xyXG4gICAgICAgIHZhciB3ZWVrT2JqID0ge1xyXG4gICAgICAgICAgICBpZDogd2Vla1swXS53ZWVrKCksXHJcbiAgICAgICAgICAgIGxhYmVsOiB3ZWVrWzBdLmZvcm1hdChcIkREL01NXCIpICsgXCIgYXUgXCIgKyB3ZWVrW3dlZWsubGVuZ3RoIC0gMV0uZm9ybWF0KFwiREQvTU1cIiksXHJcbiAgICAgICAgICAgIGRheXM6IHdlZWtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHdlZWtPYmopO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb252ZXJ0U3RyaW5nVG9EYXRlKHN0ckRhdGUpIHtcclxuICAgIHZhciB0YWJEYXRlID0gc3RyRGF0ZS5zcGxpdChcIi9cIik7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh0YWJEYXRlWzFdICsgXCIvXCIgKyB0YWJEYXRlWzBdICsgXCIvXCIgKyB0YWJEYXRlWzJdKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxudmFyIGNvbnNvbW1hdGlvblNlcnZpY2UgPSBmdW5jdGlvbiAoYWxsb2NhdGlvblNlcnZpY2UpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZENvbnNvbW1hdGlvbnM6IGZ1bmN0aW9uIChwcm9qZWN0LCBzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLnF1ZXJ5KGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKG1lbWJlcikge1xyXG4vLyBuZWVkIHRvIG11bHRpcHkgYnkgMTAwMCBmb3IgZ2V0IFVOSVggVGltZXN0YW1wXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtYmVyLmltcHV0YXRpb25zID0gbWVtYmVyLnJlc291cmNlKFwiaW1wdXRhdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldCh7c3RhcnQ6IHN0YXJ0LmZvcm1hdChcIlhcIikgKiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogZW5kLmZvcm1hdChcIlhcIikgKiAxMDAwfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBncm91cEJ5V2VlazogZnVuY3Rpb24gKGVudHJpZXMsIGRheXMpIHtcclxuICAgICAgICAgICAgdmFyIGdyb3VwZWQgPSB7XHJcbiAgICAgICAgICAgICAgICB3ZWVrczogZ3JvdXBXZWVrcyhkYXlzKSxcclxuICAgICAgICAgICAgICAgIGVudHJpZXM6IGVudHJpZXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVudHJpZXMsIGZ1bmN0aW9uIChlbnRyeSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkuaW1wdXRhdGlvbnMuJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdyb3VwZWRJbXB1dGF0aW9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChncm91cGVkLndlZWtzLCBmdW5jdGlvbiAod2Vlaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZVNwZW50ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHdlZWsuZGF5cywgZnVuY3Rpb24gKGRheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVNwZW50ICs9IGVudHJ5LmltcHV0YXRpb25zLmltcHV0YXRpb25zW2RheS5mb3JtYXQoXCJERC9NTS9ZWVlZXCIpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwZWRJbXB1dGF0aW9uc1t3ZWVrLmlkXSA9IHRpbWVTcGVudDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBlbnRyeS5pbXB1dGF0aW9ucy5pbXB1dGF0aW9ucyA9IGdyb3VwZWRJbXB1dGF0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZW50cnkuaW1wdXRhdGlvbnMuZGV0YWlscywgZnVuY3Rpb24gKGRldGFpbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JvdXBlZERldGFpbHNJbXB1dGF0aW9uID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChncm91cGVkLndlZWtzLCBmdW5jdGlvbiAod2Vlaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVTcGVudCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2god2Vlay5kYXlzLCBmdW5jdGlvbiAoZGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVNwZW50ICs9IGRldGFpbC5pbXB1dGF0aW9uc1tkYXkuZm9ybWF0KFwiREQvTU0vWVlZWVwiKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwZWREZXRhaWxzSW1wdXRhdGlvblt3ZWVrLmlkXSA9IHRpbWVTcGVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbC5pbXB1dGF0aW9ucyA9IGdyb3VwZWREZXRhaWxzSW1wdXRhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGdyb3VwZWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjaGVja01pc3NpbmdCeURheTogZnVuY3Rpb24gKGVudHJpZXMsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgICAgICAgICAgdmFyIGFsbG9jYXRpb25zID0gYWxsb2NhdGlvblNlcnZpY2UubG9hZEFsbG9jYXRpb24oYXBwUGFyYW1ldGVycyk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbnRyaWVzLCBmdW5jdGlvbiAoZW50cnkpIHtcclxuICAgICAgICAgICAgICAgIGVudHJ5LmltcHV0YXRpb25zLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cnkuaW1wdXRhdGlvbnMuaW1wdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmltcHV0YXRpb25zLmltcHV0YXRpb25zW2ldLnZhbEltcHV0YXRpb24gIT09IHBhcnNlSW50KGFsbG9jYXRpb25zLm1heCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0U3RyaW5nVG9EYXRlKGVudHJ5LmltcHV0YXRpb25zLmltcHV0YXRpb25zW2ldLmltcHV0YXRpb25EYXRlKSA8IG5ldyBEYXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5LmltcHV0YXRpb25zLmltcHV0YXRpb25zW2ldLmFyZU1pc3NpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG59O1xyXG5jb25zb21tYXRpb25TZXJ2aWNlLiRpbmplY3QgPSBbXCJhbGxvY2F0aW9uU2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb25zb21tYXRpb25TZXJ2aWNlOyIsInZhciBnYW50dENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBwcm9qZWN0LCBnYW50dFNlcnZpY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5hZGRUYXNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRUYXNrQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkVGFza0N0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHt9KTtcclxuICAgIH07XHJcbiAgICB2bS5kYXRhID0gZ2FudHRTZXJ2aWNlLmxvYWRSb3dzKHByb2plY3QpO1xyXG59O1xyXG5nYW50dENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInByb2plY3RcIiwgXCJnYW50dFNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gZ2FudHRDb250cm9sbGVyO1xyXG4iLCJ2YXIgZ2FudHRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vZ2FudHQuY29udHJvbGxlclwiKTtcclxudmFyIGdhbnR0U2VydmljZSA9IHJlcXVpcmUoXCIuL2dhbnR0LnNlcnZpY2VcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoXCJrYW5iYW4ucHJvamVjdC5nYW50dFwiLCBcclxuICAgIFtcImdhbnR0XCIsICdnYW50dC5zb3J0YWJsZScsICdnYW50dC5tb3ZhYmxlJywgJ2dhbnR0Lm92ZXJsYXAnLFxyXG4gICAgJ2dhbnR0LmRlcGVuZGVuY2llcycsICdnYW50dC50b29sdGlwcycsICdnYW50dC5ib3VuZHMnLCBcclxuICAgICdnYW50dC50YWJsZScsICdnYW50dC50cmVlJywgJ2dhbnR0Lmdyb3VwcycsICdnYW50dC5yZXNpemVTZW5zb3InXSlcclxuICAgICAgICAuY29udHJvbGxlcihcImdhbnR0Q29udHJvbGxlclwiLCBnYW50dENvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJnYW50dFNlcnZpY2VcIiwgZ2FudHRTZXJ2aWNlKTtcclxuIiwidmFyIGdhbnR0U2VydmljZSA9IGZ1bmN0aW9uICgkcSkge1xyXG5cclxuICAgIHZhciByZXRyaWV2ZVRhc2tCeVN3aW1sYW5lID0gZnVuY3Rpb24gKHByb2plY3QsIHN3aW1sYW5lKSB7XHJcbiAgICAgICAgc3dpbWxhbmUudGFza3MgPSBbXTtcclxuICAgICAgICB2YXIgZ2FudHRUYXNrcyA9IHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KHtzd2ltbGFuZTogc3dpbWxhbmUuaWR9KTtcclxuICAgICAgICBnYW50dFRhc2tzLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHRhc2tzKSB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0YXNrcywgZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICAgICAgICAgIHN3aW1sYW5lLnRhc2tzLnB1c2goZmV0Y2hUb0dhbnR0VGFzayh0YXNrKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZhciByZXRyaWV2ZVRhc2tOb1N3aW1sYW5lID0gZnVuY3Rpb24gKHByb2plY3QpIHtcclxuICAgICAgICB2YXIgYmFja2xvZyA9IHtuYW1lOiBcImJhY2tsb2dcIiwgdGFza3M6IFtdfTtcclxuICAgICAgICB2YXIgZ2FudHRUYXNrcyA9IHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLnF1ZXJ5KHtub3N3aW1sYW5lOiB0cnVlfSk7XHJcbiAgICAgICAgZ2FudHRUYXNrcy4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICh0YXNrcykge1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGFza3MsIGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrbG9nLnRhc2tzLnB1c2goZmV0Y2hUb0dhbnR0VGFzayh0YXNrKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBiYWNrbG9nO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIGZldGNoVG9HYW50dFRhc2sgPSBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgIHZhciBzdGFydERhdGUgPSBtb21lbnQoKTtcclxuICAgICAgICB2YXIgZW5kRGF0ZSA9IG1vbWVudCgpO1xyXG4gICAgICAgIGlmICh0YXNrLnBsYW5uZWRTdGFydCkge1xyXG4gICAgICAgICAgICBzdGFydERhdGUgPSB0YXNrLnBsYW5uZWRTdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRhc2sucGxhbm5lZEVuZGluZykge1xyXG4gICAgICAgICAgICBlbmREYXRlID0gdGFzay5wbGFubmVkRW5kaW5nO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdGFzay5pZCxcclxuICAgICAgICAgICAgbmFtZTogdGFzay5uYW1lLFxyXG4gICAgICAgICAgICBmcm9tOiBzdGFydERhdGUsXHJcbiAgICAgICAgICAgIHRvOiBlbmREYXRlLFxyXG4gICAgICAgICAgICBjb2xvcjogXCIjMDI4OGQxXCJcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbG9hZFJvd3M6IGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gW107XHJcbiAgICAgICAgICAgIGRhdGEucHVzaChyZXRyaWV2ZVRhc2tOb1N3aW1sYW5lKHByb2plY3QpKTtcclxuICAgICAgICAgICAgdmFyIHN3aW1sYW5lc1Jlc291cmNlID0gcHJvamVjdC5yZXNvdXJjZShcInN3aW1sYW5lXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgIHN3aW1sYW5lc1Jlc291cmNlLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHN3aW1sYW5lcykge1xyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN3aW1sYW5lcywgZnVuY3Rpb24gKHN3aW1sYW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHN3aW1sYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICByZXRyaWV2ZVRhc2tCeVN3aW1sYW5lKHByb2plY3QsIHN3aW1sYW5lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmdhbnR0U2VydmljZS4kaW5qZWN0ID0gW1wiJHFcIl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdhbnR0U2VydmljZTtcclxuIiwidmFyIGthbmJhbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBwcm9qZWN0LCBrYW5iYW5TZXJ2aWNlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgXHJcbiAgICB2YXIgbG9hZEthbmJhbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2bS5zdGF0ZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoe1wia2FuYmFuXCI6IHRydWV9KTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBrYW5iYW5TZXJ2aWNlLmxvYWQocHJvamVjdCk7XHJcbiAgICAgICAgdm0uc3dpbWxhbmVzVG9GaWx0cmUgPSB2bS5zd2ltbGFuZXM7XHJcbiAgICB9O1xyXG4gICAgcHJvamVjdC4kcHJvbWlzZS50aGVuKGxvYWRLYW5iYW4pO1xyXG4gICAgdm0uYWRkVGFzayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVGFza0NvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFRhc2tDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdDtcclxuICAgICAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihsb2FkS2FuYmFuKTtcclxuICAgIH07XHJcbiAgICB2bS5rYW5iYW5Tb3J0T3B0aW9ucyA9IHtcclxuICAgICAgICBpdGVtTW92ZWQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgdGFzayA9IGV2ZW50LnNvdXJjZS5pdGVtU2NvcGUubW9kZWxWYWx1ZTtcclxuICAgICAgICAgICAgdGFzay5zdGF0ZS5pZCA9IGV2ZW50LmRlc3Quc29ydGFibGVTY29wZS5lbGVtZW50LmF0dHIoXCJkYXRhLWNvbHVtbmluZGV4XCIpO1xyXG4gICAgICAgICAgICB2YXIgc3dpbWxhbmVJZCA9IGV2ZW50LmRlc3Quc29ydGFibGVTY29wZS5lbGVtZW50LmF0dHIoXCJkYXRhLXJvd2luZGV4XCIpO1xyXG4gICAgICAgICAgICBpZiAoc3dpbWxhbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0YXNrLnN3aW1sYW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFzay5zd2ltbGFuZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGFzay5zd2ltbGFuZS5pZCA9IGV2ZW50LmRlc3Quc29ydGFibGVTY29wZS5lbGVtZW50LmF0dHIoXCJkYXRhLXJvd2luZGV4XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFzay5zd2ltbGFuZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGFzay5yZXNvdXJjZShcInNlbGZcIikuc2F2ZShudWxsLCB0YXNrLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5zdGF0ZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoe1wib3JkZXJcIjogXCJwb3NpdGlvblwiLCBcImthbmJhblwiOiB0cnVlfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBcclxuICAgIHZtLnJlc2V0RmlsdGVyID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2bS5maWx0ZXIuY3VycmVudHVzZXIgPSBmYWxzZTtcclxuICAgICAgICB2bS5maWx0ZXIudXJnZW50PSBmYWxzZTtcclxuICAgIH07XHJcbn07XHJcbmthbmJhbkNvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInByb2plY3RcIiwgXCJrYW5iYW5TZXJ2aWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGthbmJhbkNvbnRyb2xsZXI7XHJcbiIsInZhciBrYW5iYW5Db250cm9sbGVyID0gcmVxdWlyZShcIi4va2FuYmFuLmNvbnRyb2xsZXJcIik7XHJcbnZhciBrYW5iYW5TZXJ2aWNlID0gcmVxdWlyZShcIi4va2FuYmFuLnNlcnZpY2VcIik7XHJcbnZhciBjdXJyZW50dXNlckthbmJhbkZpbHRlciA9IHJlcXVpcmUoXCIuL3VzZXIuZmlsdGVyXCIpO1xyXG52YXIgdXJnZW50S2FuYmFuRmlsdGVyID0gcmVxdWlyZShcIi4vdXJnZW50LmZpbHRlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3Qua2FuYmFuJywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJrYW5iYW5Db250cm9sbGVyXCIsIGthbmJhbkNvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJrYW5iYW5TZXJ2aWNlXCIsIGthbmJhblNlcnZpY2UpXHJcbiAgICAgICAgLmZpbHRlcihcImN1cnJlbnR1c2VyS2FuYmFuRmlsdGVyXCIsIGN1cnJlbnR1c2VyS2FuYmFuRmlsdGVyKVxyXG4gICAgICAgIC5maWx0ZXIoXCJ1cmdlbnRLYW5iYW5GaWx0ZXJcIiwgdXJnZW50S2FuYmFuRmlsdGVyKTsiLCJ2YXIga2FuYmFuU2VydmljZSA9IGZ1bmN0aW9uICgkcSwgdGFza0Fzc2VtYmxlclNlcnZpY2UpIHtcclxuXHJcbiAgICB2YXIgZmV0Y2hLYW5iYW5UYXNrID0gZnVuY3Rpb24gKHRhc2tzKSB7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xyXG4gICAgICAgICAgICB0YXNrID0gdGFza0Fzc2VtYmxlclNlcnZpY2UodGFzayk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2tzO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgcmV0cmlldmVUYXNrQnlTd2ltbGFuZSA9IGZ1bmN0aW9uIChwcm9qZWN0LCBzdGF0ZXMsIHN3aW1sYW5lSWQpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXN1bHRbaV0gPSB7aWQ6IHN0YXRlLmlkfTtcclxuICAgICAgICAgICAgcmVzdWx0W2ldLnRhc2tzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoXHJcbiAgICAgICAgICAgICAgICAgICAge1wic3dpbWxhbmVcIjogc3dpbWxhbmVJZCwgXCJzdGF0ZVwiOiBzdGF0ZS5pZH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hLYW5iYW5UYXNrKTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciByZXRyaWV2ZVRhc2tOb1N3aW1sYW5lID0gZnVuY3Rpb24gKHByb2plY3QsIHN0YXRlcykge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXSA9IHtpZDogc3RhdGUuaWR9O1xyXG4gICAgICAgICAgICByZXN1bHRbaV0udGFza3MgPSBwcm9qZWN0LnJlc291cmNlKFwidGFza1wiKS5xdWVyeShcclxuICAgICAgICAgICAgICAgICAgICB7XCJub3N3aW1sYW5lXCI6IHRydWUsIFwic3RhdGVcIjogc3RhdGUuaWR9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoS2FuYmFuVGFzayk7XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGxvYWQ6IGZ1bmN0aW9uIChwcm9qZWN0KSB7XHJcbiAgICAgICAgICAgIHZhciB0YXNrcyA9IFtdO1xyXG4gICAgICAgICAgICBwcm9qZWN0LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlc1Jlc291cmNlID0gcHJvamVjdC5yZXNvdXJjZShcInN0YXRlXCIpLnF1ZXJ5KHtcImthbmJhblwiOiB0cnVlfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3dpbWxhbmVzUmVzb3VyY2UgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICAgICAgICAgICRxLmFsbChbc3RhdGVzUmVzb3VyY2UuJHByb21pc2UsIHN3aW1sYW5lc1Jlc291cmNlLiRwcm9taXNlXSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0ZXMgPSBkYXRhWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzd2ltbGFuZXMgPSBkYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzd2ltbGFuZXMsIGZ1bmN0aW9uIChzd2ltbGFuZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrcy5wdXNoKHN3aW1sYW5lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpbWxhbmUuc3RhdGVzID0gcmV0cmlldmVUYXNrQnlTd2ltbGFuZShwcm9qZWN0LCBzdGF0ZXMsIHN3aW1sYW5lLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9zd2ltbGFuZSA9IHtzdGF0ZXM6IHN0YXRlcyA9IHJldHJpZXZlVGFza05vU3dpbWxhbmUocHJvamVjdCwgc3RhdGVzKX07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaChub3N3aW1sYW5lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRhc2tzO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcbmthbmJhblNlcnZpY2UuJGluamVjdCA9IFtcIiRxXCIsIFwidGFza0Fzc2VtYmxlclNlcnZpY2VcIl07XHJcbm1vZHVsZS5leHBvcnRzID0ga2FuYmFuU2VydmljZTtcclxuIiwiZnVuY3Rpb24gdXJnZW50S2FuYmFuRmlsdGVyKCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgYWN0aXZhdGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXRbaV0udXJnZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2goaW5wdXRbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH1cclxuICAgIDtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IHVyZ2VudEthbmJhbkZpbHRlcjtcclxuXHJcbiIsImZ1bmN0aW9uIGN1cnJlbnR1c2VyS2FuYmFuRmlsdGVyKGN1cnJlbnRVc2VyU2VydmljZSkge1xyXG4gICAgdmFyIGN1cnJlbnR1c2VyID0gY3VycmVudFVzZXJTZXJ2aWNlLmdldCgpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgYWN0aXZhdGUpIHtcclxuICAgICAgICBpZiAoYWN0aXZhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG91dCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGlucHV0W2ldLmFzc2lnbmVlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFtpXS5hc3NpZ25lZXNbal0udXNlcklkID09PSBjdXJyZW50dXNlci5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQucHVzaChpbnB1dFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnB1dDtcclxuICAgIH07XHJcbn1cclxuXHJcbmN1cnJlbnR1c2VyS2FuYmFuRmlsdGVyLiRpbmplY3Q9W1wiY3VycmVudFVzZXJTZXJ2aWNlXCJdO1xyXG5cclxubW9kdWxlLmV4cG9ydHM9Y3VycmVudHVzZXJLYW5iYW5GaWx0ZXI7XHJcblxyXG4iLCJ2YXIgcmVzb2x2ZVByb2plY3QgPSBmdW5jdGlvbiAoJHN0YXRlUGFyYW1zLCBwcm9qZWN0U2VydmljZSkge1xyXG4gICAgcmV0dXJuIHByb2plY3RTZXJ2aWNlLmdldCh7XCJwcm9qZWN0SWRcIjogJHN0YXRlUGFyYW1zLnByb2plY3RJZH0pO1xyXG59O1xyXG5yZXNvbHZlUHJvamVjdC4kaW5qZWN0ID0gW1wiJHN0YXRlUGFyYW1zXCIsIFwicHJvamVjdFNlcnZpY2VcIl07XHJcblxyXG52YXIgcmVzb2x2ZVVzZXJSaWdodHMgPSBmdW5jdGlvbiAoJHEsICRzdGF0ZVBhcmFtcywgY3VycmVudHVzZXIpIHtcclxuICAgIHZhciBkZWZlciA9ICRxLmRlZmVyKCk7XHJcbiAgICBjdXJyZW50dXNlci4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNBZG1pbiA9IChjdXJyZW50dXNlci5hcHBsaWNhdGlvblJvbGUgPT09IFwiQURNSU5cIik7XHJcbiAgICAgICAgY3VycmVudHVzZXIucmVzb3VyY2UoXCJtZW1iZXJcIikuZ2V0KHtcInByb2plY3RJZFwiOiAkc3RhdGVQYXJhbXMucHJvamVjdElkfSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIHByb2plY3RSb2xlID0gZGF0YS5wcm9qZWN0Um9sZTtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0cyA9IHtcclxuICAgICAgICAgICAgICAgIGhhc0FkbWluUmlnaHRzOiAoaXNBZG1pbiB8fCBwcm9qZWN0Um9sZSA9PT0gXCJNQU5BR0VSXCIpLFxyXG4gICAgICAgICAgICAgICAgaGFzRWRpdFJpZ2h0czogKGlzQWRtaW4gfHwgcHJvamVjdFJvbGUgPT09IFwiTUFOQUdFUlwiIHx8IHByb2plY3RSb2xlID09PSBcIkNPTlRSSUJVVE9SXCIpLFxyXG4gICAgICAgICAgICAgICAgaGFzUmVhZFJpZ2h0czogKGlzQWRtaW4gfHwgcHJvamVjdFJvbGUpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRlZmVyLnJlc29sdmUocmlnaHRzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XHJcbn07XHJcbnJlc29sdmVVc2VyUmlnaHRzLiRpbmplY3QgPSBbXCIkcVwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcImN1cnJlbnR1c2VyXCJdO1xyXG5cclxudmFyIGNvbmZpZyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdFwiLCB7XHJcbiAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJwcm9qZWN0Q29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJwcm9qZWN0Q3RybFwiLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L2xheW91dC1zaW5nbGUuaHRtbFwiLFxyXG4gICAgICAgIHVybDogXCJwcm9qZWN0Lzpwcm9qZWN0SWQvXCIsXHJcbiAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICBwcm9qZWN0OiByZXNvbHZlUHJvamVjdCxcclxuICAgICAgICAgICAgdXNlclJpZ2h0czogcmVzb2x2ZVVzZXJSaWdodHNcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3Qua2FuYmFuXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC9rYW5iYW4va2FuYmFuLmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImthbmJhbkNvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwia2FuYmFuQ3RybFwiLFxyXG4gICAgICAgIHVybDogXCJrYW5iYW5cIlxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShcImFwcC5wcm9qZWN0LmdhbnR0XCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC9nYW50dC9nYW50dC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJnYW50dENvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwiZ2FudHRDdHJsXCIsXHJcbiAgICAgICAgdXJsOiBcImdhbnR0XCJcclxuICAgIH0pO1xyXG59O1xyXG5jb25maWcuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcclxuXHJcbiIsIiAgICAgICAgdmFyIHByb2plY3RDb250cm9sbGVyID0gZnVuY3Rpb24gKCRzdGF0ZSwgcHJvamVjdCwgdXNlclJpZ2h0cykge1xyXG4gICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICB2bS5wcm9qZWN0ID0gcHJvamVjdDtcclxuICAgICAgICAgICAgaWYgKCF1c2VyUmlnaHRzLmhhc1JlYWRSaWdodHMpIHtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oXCJhcHAuZGFzaGJvYXJkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZtLnJpZ2h0cyA9IHVzZXJSaWdodHM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm9qZWN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHN0YXRlXCIsIFwicHJvamVjdFwiLCBcInVzZXJSaWdodHNcIl07XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBwcm9qZWN0Q29udHJvbGxlcjsiLCJ2YXIga2FuYmFuTW9kdWxlID0gcmVxdWlyZShcIi4va2FuYmFuL2thbmJhbi5tb2R1bGVcIik7XHJcbnZhciB0YXNrTW9kdWxlID0gcmVxdWlyZShcIi4vdGFzay90YXNrLm1vZHVsZVwiKTtcclxudmFyIGNvbnNvbW1hdGlvbk1vZHVsZSA9IHJlcXVpcmUoXCIuL2NvbnNvbW1hdGlvbi9jb25zb21tYXRpb24ubW9kdWxlXCIpO1xyXG52YXIgZ2FudHRNb2R1bGUgPSByZXF1aXJlKFwiLi9nYW50dC9nYW50dC5tb2R1bGVcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi9wcm9qZWN0LmNvbmZpZ1wiKTtcclxudmFyIHByb2plY3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vcHJvamVjdC5jb250cm9sbGVyXCIpO1xyXG52YXIgcHJvamVjdFNlcnZpY2UgPSByZXF1aXJlKFwiLi9wcm9qZWN0LnNlcnZpY2VcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5wcm9qZWN0JyxcclxuICAgICAgICBba2FuYmFuTW9kdWxlLm5hbWUsIHRhc2tNb2R1bGUubmFtZSwgY29uc29tbWF0aW9uTW9kdWxlLm5hbWUsXHJcbiAgICAgICAgICAgIGdhbnR0TW9kdWxlLm5hbWVdKVxyXG4gICAgICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwicHJvamVjdENvbnRyb2xsZXJcIiwgcHJvamVjdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLnNlcnZpY2UoXCJwcm9qZWN0U2VydmljZVwiLCBwcm9qZWN0U2VydmljZSk7IiwidmFyIHByb2plY3RTZXJ2aWNlID0gZnVuY3Rpb24gKCRyZXNvdXJjZSkge1xyXG4gICAgcmV0dXJuICRyZXNvdXJjZShcIi9hcGkvcHJvamVjdC86cHJvamVjdElkXCIpO1xyXG59O1xyXG5wcm9qZWN0U2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHByb2plY3RTZXJ2aWNlOyIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uY2F0ZWdvcmllcyA9IHByb2plY3QucmVzb3VyY2UoXCJjYXRlZ29yeVwiKS5xdWVyeSgpO1xyXG4gICAgdm0uc3dpbWxhbmVzID0gcHJvamVjdC5yZXNvdXJjZShcInN3aW1sYW5lXCIpLnF1ZXJ5KCk7XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikuc2F2ZSh2bS50YXNrLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwicHJvamVjdFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyOyIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCB0YXNrLCBwcm9qZWN0KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0uZ2V0TWVtYmVycyA9IGZ1bmN0aW9uICh0ZXJtKSB7XHJcbiAgICAgICAgcmV0dXJuIHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikucXVlcnkoe3NlYXJjaDogdGVybX0pLiRwcm9taXNlO1xyXG4gICAgfTtcclxuICAgIHZtLnNlbGVjdE1lbWJlciA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2bS5hbGxvY2F0aW9uLm1lbWJlciA9ICRtb2RlbDtcclxuICAgIH07XHJcbiAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGFzay5yZXNvdXJjZShcImFsbG9jYXRpb25cIikuc2F2ZSh2bS5hbGxvY2F0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbmFkZENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbEluc3RhbmNlXCIsIFwidGFza1wiLCBcInByb2plY3RcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gYWRkQ29udHJvbGxlcjsiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9saXN0LmNvbnRyb2xsZXJcIik7XHJcbnZhciBhZGRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vYWRkLmNvbnRyb2xsZXJcIik7XHJcbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2thbmJhbi5wcm9qZWN0LnRhc2suYWxsb2NhdGlvbicsIFtdKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiYWxsb2NhdGlvbkxpc3RDb250cm9sbGVyXCIsIGxpc3RDb250cm9sbGVyKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiYWxsb2NhdGlvbkFkZENvbnRyb2xsZXJcIiwgYWRkQ29udHJvbGxlcikiLCJ2YXIgbGlzdENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoJHVpYk1vZGFsLCBjdXJyZW50dGFzaywgY3VycmVudHByb2plY3QpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvdGFzay9hbGxvY2F0aW9uL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWxsb2NhdGlvbkFkZENvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZEFsbG9jYXRpb25DdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHRhc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudHRhc2s7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50cHJvamVjdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJ4ZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZtLmFsbG9jYXRpb25zID0gY3VycmVudHRhc2sucmVzb3VyY2UoXCJhbGxvY2F0aW9uXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uZGVsZXRlID0gZnVuY3Rpb24gKGFsbG9jYXRpb24pIHtcclxuICAgICAgICBhbGxvY2F0aW9uLnJlc291cmNlKFwic2VsZlwiKS5kZWxldGUobnVsbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5hbGxvY2F0aW9ucyA9IGN1cnJlbnR0YXNrLnJlc291cmNlKFwiYWxsb2NhdGlvblwiKS5xdWVyeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLmFsbG9jYXRpb25zID0gY3VycmVudHRhc2suYWxsb2NhdGlvbnMgPSBjdXJyZW50dGFzay5yZXNvdXJjZShcImFsbG9jYXRpb25cIikucXVlcnkoKTtcclxufTtcclxubGlzdENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiR1aWJNb2RhbFwiLCBcInRhc2tcIiwgXCJwcm9qZWN0XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsInZhciBhZGRDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCB0YXNrLCBjb21tZW50KSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgaWYgKGNvbW1lbnQuaWQpIHtcclxuICAgICAgICB2bS5wYXJlbnRDb21tZW50ID0gY29tbWVudDtcclxuICAgIH1cclxuICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodm0ucGFyZW50Q29tbWVudCkge1xyXG4gICAgICAgICAgICB2bS5wYXJlbnRDb21tZW50LnJlc291cmNlKFwicmVwbHlcIikuc2F2ZSh2bS5jb21tZW50LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFzay5yZXNvdXJjZShcImNvbW1lbnRcIikuc2F2ZSh2bS5jb21tZW50LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufTtcclxuYWRkQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsSW5zdGFuY2VcIiwgXCJ0YXNrXCIsIFwiY29tbWVudFwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBhZGRDb250cm9sbGVyO1xyXG5cclxuIiwidmFyIGxpc3RDb250cm9sbGVyID0gcmVxdWlyZShcIi4vbGlzdC5jb250cm9sbGVyXCIpO1xyXG52YXIgYWRkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2FkZC5jb250cm9sbGVyXCIpO1xyXG52YXIgcmVwbHlDb250cm9sbGVyID0gcmVxdWlyZShcIi4vcmVwbHkuY29udHJvbGxlclwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QudGFzay5jb21tZW50JywgW10pXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJjb21tZW50TGlzdENvbnRyb2xsZXJcIiwgbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJjb21tZW50QWRkQ29udHJvbGxlclwiLCBhZGRDb250cm9sbGVyKVxyXG4gICAgICAgIC5jb250cm9sbGVyKFwiY29tbWVudFJlcGx5Q29udHJvbGxlclwiLCByZXBseUNvbnRyb2xsZXIpOyIsInZhciBsaXN0Q29udHJvbGxlciA9IGZ1bmN0aW9uICgkdWliTW9kYWwsIHNjb3BlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdmFyIGN1cnJlbnR0YXNrID0gc2NvcGUudGFza0N0cmwudGFzaztcclxuICAgIHZtLmFkZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL2NvbW1lbnQvYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJjb21tZW50QWRkQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkQ29tbWVudEN0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgdGFzazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50dGFzaztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb21tZW50OiB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdm0uY29tbWVudHMgPSBjdXJyZW50dGFzay5yZXNvdXJjZShcImNvbW1lbnRcIikucXVlcnkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICB2bS5yZXBseSA9IGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL3Byb2plY3QvdGFzay9jb21tZW50L2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiY29tbWVudEFkZENvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZENvbW1lbnRDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tbWVudDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0YXNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnR0YXNrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29tbWVudC5zaG93Q29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnNlbGVjdGVkQ29tbWVudCA9IGNvbW1lbnQucmVzb3VyY2UoXCJyZXBseVwiKS5xdWVyeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnNob3dIaWRlUmVwbHkgPSBmdW5jdGlvbiAoY29tbWVudCkge1xyXG4gICAgICAgIGlmIChjb21tZW50LnNob3dDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnQuc2hvd0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2bS5zZWxlY3RlZENvbW1lbnQgPSBjb21tZW50LnJlc291cmNlKFwicmVwbHlcIikucXVlcnkoKTtcclxuICAgICAgICAgICAgY29tbWVudC5zaG93Q29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXJlbnRDb21tZW50LCBjb21tZW50KSB7XHJcbiAgICAgICAgY29tbWVudC5yZXNvdXJjZShcInNlbGZcIikuZGVsZXRlKG51bGwsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudENvbW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZtLnNlbGVjdGVkQ29tbWVudCA9IHBhcmVudENvbW1lbnQucmVzb3VyY2UoXCJyZXBseVwiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdm0uY29tbWVudHMgPSBjdXJyZW50dGFzay5yZXNvdXJjZShcImNvbW1lbnRcIikucXVlcnkoKTtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5zZWxlY3RlZENvbW1lbnQgPT09IGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5zZWxlY3RlZENvbW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgY3VycmVudHRhc2suJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdm0uY29tbWVudHMgPSBjdXJyZW50dGFzay5yZXNvdXJjZShcImNvbW1lbnRcIikucXVlcnkoKTtcclxuICAgIH0pO1xyXG59O1xyXG5saXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHVpYk1vZGFsXCIsIFwiJHNjb3BlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDb250cm9sbGVyOyIsIiAgICAgICAgdmFyIGxpc3RDb250cm9sbGVyID0gZnVuY3Rpb24gKHNjb3BlKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaChcImNvbW1lbnRMaXN0Q3RybC5zZWxlY3RlZENvbW1lbnRcIiwgZnVuY3Rpb24gKG5ld1ZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudGNvbW1lbnQgPSBuZXdWYWw7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Y29tbWVudC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucmVwbGllcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBsaXN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCJdO1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gbGlzdENvbnRyb2xsZXI7XHJcbiIsInZhciBoaXN0b0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoc2NvcGUsaGlzdG9TZXJ2aWNlKSB7XHJcbiAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgdm0ucGFnZSA9IDA7XHJcbiAgICB2bS5zaXplID0gMTA7XHJcbiAgICB2bS5jcHQgPSAwO1xyXG4gICAgdm0uYnVzeSA9IGZhbHNlO1xyXG4gICAgdm0uaGlzdG9zVGFzayA9IFtdO1xyXG4gICAgdm0ubm9Nb3JlSGlzdG8gPSBmYWxzZTtcclxuXHJcbiAgICB2bS5sb2FkSGlzdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYoIXZtLm5vTW9yZUhpc3RvKXsgLy8gV2UgY2hlY2sgdGhhdCB0aGUgbGFzdCBjYWxsIGRpZCBub3QgcmV0dXJuIG5vIHJlc3VsdFxyXG4gICAgICAgICAgICBpZighdm0uYnVzeSl7IC8vIFdlIGNoZWNrIHRoYXQgaXQgZG9lcyBub3QgYW5vdGhlciBjYWxsaW5nIHRvIHNlcnZlclxyXG4gICAgICAgICAgICAgICAgdm0uYnVzeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudHRhc2sgPSBzY29wZS50YXNrQ3RybC50YXNrO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudHRhc2suJHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudHRhc2sucmVzb3VyY2UoXCJoaXN0b1wiKS5xdWVyeSh7cGFnZTogdm0ucGFnZSwgc2l6ZTogdm0uc2l6ZX0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmhpc3Rvc1Rhc2sucHVzaChkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbiAoaGlzdG9UYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaGlzdG9zVGFza1t2bS5jcHRdID0gaGlzdG9TZXJ2aWNlKGhpc3RvVGFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3B0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmJ1c3kgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gaWYgdGhlIGxhc3QgcmV0dXJuIGhhcyBubyByZXN1bHQsIG5vTW9yZUhpc3RvIGJlY29tZXMgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubm9Nb3JlSGlzdG8gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucGFnZSA9IHZtLnBhZ2UgKyAxMDtcclxuICAgICAgICAgICAgICAgICAgICB2bS5zaXplID0gdm0uc2l6ZSArIDEwO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHZtLmxvYWRIaXN0bygpO1xyXG59O1xyXG5oaXN0b0NvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcImhpc3RvU2VydmljZVwiXTtcclxubW9kdWxlLmV4cG9ydHMgPSBoaXN0b0NvbnRyb2xsZXI7IiwidmFyIGhpc3RvQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2hpc3RvcnkuY29udHJvbGxlclwiKTtcclxudmFyIGhpc3RvU2VydmljZSA9IHJlcXVpcmUoXCIuL2hpc3Rvcnkuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QudGFzay5oaXN0b3J5JywgW10pXHJcbiAgICAuY29udHJvbGxlcihcImhpc3RvQ29udHJvbGxlclwiLCBoaXN0b0NvbnRyb2xsZXIpXHJcbiAgICAuc2VydmljZShcImhpc3RvU2VydmljZVwiLCBoaXN0b1NlcnZpY2UpOyIsInZhciBoaXN0b1NlcnZpY2UgPSBmdW5jdGlvbiAoJGh0dHAsIEhhdGVvYXNJbnRlcmZhY2UsIG1vbWVudCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChoaXN0b1Rhc2spIHtcclxuICAgICAgICBpZihoaXN0b1Rhc2suX2xpbmtzLnByb2plY3Qpe1xyXG4gICAgICAgICAgICBoaXN0b1Rhc2sucHJvamVjdE5hbWVDaGVja2VkID0gZmFsc2UgO1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoaGlzdG9UYXNrLl9saW5rcy5wcm9qZWN0KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgaWYgKGhpc3RvVGFzay5wcm9qZWN0TmFtZSA9PT0gZGF0YS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlzdG9UYXNrLnByb2plY3ROYW1lQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoaXN0b1Rhc2suX2xpbmtzLnN0YXRlKXtcclxuICAgICAgICAgICAgaGlzdG9UYXNrLnN0YXRlTmFtZUNoZWNrZWQgPSBmYWxzZSA7XHJcbiAgICAgICAgICAgICRodHRwLmdldChoaXN0b1Rhc2suX2xpbmtzLnN0YXRlKS50aGVuKGZ1bmN0aW9uKHN0YXRlKXtcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b1Rhc2suc3RhdGVOYW1lID09PSBzdGF0ZS5kYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaXN0b1Rhc2suc3RhdGVOYW1lQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoaXN0b1Rhc2suX2xpbmtzLmFzc2lnbmVlKXtcclxuICAgICAgICAgICAgaGlzdG9UYXNrLmFzc2lnbmVlTmFtZUNoZWNrZWQgPSBmYWxzZSA7XHJcbiAgICAgICAgICAgICRodHRwLmdldChoaXN0b1Rhc2suX2xpbmtzLmFzc2lnbmVlKS50aGVuKGZ1bmN0aW9uKGFzc2lnbmVlKXtcclxuICAgICAgICAgICAgICAgIGlmIChoaXN0b1Rhc2suYXNzaWduZWVOYW1lID09PSBhc3NpZ25lZS5kYXRhLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaXN0b1Rhc2suYXNzaWduZWVOYW1lQ2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihoaXN0b1Rhc2suX2xpbmtzLmNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIGhpc3RvVGFzay5jYXRlZ29yeU5hbWVDaGVja2VkID0gZmFsc2UgO1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoaGlzdG9UYXNrLl9saW5rcy5jYXRlZ29yeSkudGhlbihmdW5jdGlvbihjYXRlZ29yeSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGlzdG9UYXNrLmNhdGVnb3J5TmFtZSA9PT0gY2F0ZWdvcnkuZGF0YS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlzdG9UYXNrLmNhdGVnb3J5TmFtZUNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaGlzdG9UYXNrLl9saW5rcy5zd2ltbGFuZSl7XHJcbiAgICAgICAgICAgIGhpc3RvVGFzay5zd2ltbGFuZU5hbWVDaGVja2VkID0gZmFsc2UgO1xyXG4gICAgICAgICAgICAkaHR0cC5nZXQoaGlzdG9UYXNrLl9saW5rcy5zd2ltbGFuZSkudGhlbihmdW5jdGlvbihzd2ltbGFuZSl7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGlzdG9UYXNrLnN3aW1sYW5lTmFtZSA9PT0gc3dpbWxhbmUuZGF0YS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlzdG9UYXNrLnN3aW1sYW5lTmFtZUNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhpc3RvVGFzaztcclxuICAgIH07XHJcbn1cclxuXHJcbmhpc3RvU2VydmljZS4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCJIYXRlb2FzSW50ZXJmYWNlXCIsIFwibW9tZW50XCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGhpc3RvU2VydmljZTtcclxuIiwidmFyIHRhc2tDb250cm9sbGVyID0gZnVuY3Rpb24gKCR1aWJNb2RhbCwgcHJvamVjdCwgdGFza0Fzc2VtYmxlclNlcnZpY2UsIEhhdGVvYXNJbnRlcmZhY2UpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5maWx0ZXIgPSB7c3RhdGU6IFwiYWxsXCIsIHN3aW1sYW5lOiBcImFsbFwiLCBjYXRlZ29yeTogXCJhbGxcIiwgbWVtYmVyOiBcImFsbFwifTtcclxuICAgIHZtLmxvYWRQYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLmdldChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlOiB2bS50YXNrcy5wYWdlLm51bWJlciAtIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogdm0udGFza3MucGFnZS5zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IHZtLnNvcnQuZmllbGQsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogdm0uc29ydC5zb3J0RGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5fZW1iZWRkZWQpIHtcclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLl9lbWJlZGRlZC50YXNrUmVzb3VyY2VMaXN0LCB0YXNrQXNzZW1ibGVyU2VydmljZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YS5wYWdlLm51bWJlcisrO1xyXG4gICAgICAgICAgICB2bS50YXNrcyA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdm0uc3RhdGVzID0gcHJvamVjdC5yZXNvdXJjZShcInN0YXRlXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgdm0uc3dpbWxhbmVzID0gcHJvamVjdC5yZXNvdXJjZShcInN3aW1sYW5lXCIpLnF1ZXJ5KCk7XHJcbiAgICAgICAgdm0ubWVtYmVycyA9IHByb2plY3QucmVzb3VyY2UoXCJtZW1iZXJcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5jYXRlZ29yaWVzID0gcHJvamVjdC5yZXNvdXJjZShcImNhdGVnb3J5XCIpLnF1ZXJ5KCk7XHJcbiAgICB9O1xyXG4gICAgdm0udGFza3MgPSB7XHJcbiAgICAgICAgcGFnZToge1xyXG4gICAgICAgICAgICBzaXplOiAxMCxcclxuICAgICAgICAgICAgbnVtYmVyOiAxXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnNvcnQgPSB7XHJcbiAgICAgICAgZmllbGQ6IFwibmFtZVwiLFxyXG4gICAgICAgIHNvcnREaXJlY3Rpb246IFwiZGVzY1wiXHJcbiAgICB9O1xyXG4gICAgdm0ubG9hZFBhZ2UoKTtcclxuICAgIHZtLmRlbGV0ZSA9IGZ1bmN0aW9uICh0YXNrKSB7XHJcbiAgICAgICAgbmV3IEhhdGVvYXNJbnRlcmZhY2UodGFzaykucmVzb3VyY2UoXCJzZWxmXCIpLmRlbGV0ZSh2bS5sb2FkUGFnZSk7XHJcbiAgICB9O1xyXG4gICAgdm0uYWRkVGFzayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL2FkZC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYWRkVGFza0NvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImFkZFRhc2tDdHJsXCIsXHJcbiAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgIHByb2plY3Q6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvamVjdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogXCJtZFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbih2bS5sb2FkUGFnZSk7XHJcbiAgICB9O1xyXG4gICAgdm0udGFibGVGaWx0ZXIgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XHJcbiAgICAgICAgaWYgKHZtLnNvcnQuZmllbGQgIT09IHByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgICB2bS5zb3J0LnNvcnREaXJlY3Rpb24gPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2bS5zb3J0LnNvcnREaXJlY3Rpb24gPSB2bS5zb3J0LnNvcnREaXJlY3Rpb24gPT09IFwiZGVzY1wiID8gXCJhc2NcIiA6IFwiZGVzY1wiO1xyXG4gICAgICAgIHZtLnNvcnQuZmllbGQgPSBwcmVkaWNhdGU7XHJcbiAgICAgICAgdm0ubG9hZFBhZ2UoKTtcclxuICAgIH07XHJcbiAgICB2bS5jaGFuZ2VkRmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgZmlsdGVyID0ge307XHJcbiAgICAgICAgaWYgKHZtLmZpbHRlci5zdGF0ZSAhPT0gXCJhbGxcIikge1xyXG4gICAgICAgICAgICBmaWx0ZXIuaWRTdGF0ZSA9IHZtLmZpbHRlci5zdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2bS5maWx0ZXIuc3dpbWxhbmUgIT09IFwiYWxsXCIpIHtcclxuICAgICAgICAgICAgZmlsdGVyLmlkU3dpbWxhbmUgPSB2bS5maWx0ZXIuc3dpbWxhbmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodm0uZmlsdGVyLm1lbWJlciAhPT0gXCJhbGxcIikge1xyXG4gICAgICAgICAgICBmaWx0ZXIuaWRBc3NpZ25lZSA9IHZtLmZpbHRlci5tZW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodm0uZmlsdGVyLmNhdGVnb3J5ICE9PSAnYWxsJykge1xyXG4gICAgICAgICAgICBmaWx0ZXIuaWRDYXRlZ29yeSA9IHZtLmZpbHRlci5jYXRlZ29yeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodm0uZmlsdGVyLmRlbGV0ZWQpe1xyXG4gICAgICAgICAgICBmaWx0ZXIuZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2plY3QucmVzb3VyY2UoXCJ0YXNrXCIpLmdldCh7aWRTdGF0ZTogZmlsdGVyLmlkU3RhdGUsIGlkU3dpbWxhbmUgOiBmaWx0ZXIuaWRTd2ltbGFuZSwgaWRBc3NpZ25lZSA6IGZpbHRlci5pZEFzc2lnbmVlLFxyXG4gICAgICAgICAgICBpZENhdGVnb3J5IDogZmlsdGVyLmlkQ2F0ZWdvcnksIGRlbGV0ZWQgOiBmaWx0ZXIuZGVsZXRlZCwgcGFnZTogdm0udGFza3MucGFnZS5udW1iZXIgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IHZtLnRhc2tzLnBhZ2Uuc2l6ZSwgc29ydDogdm0uc29ydC5maWVsZCwgc29ydERpcmVjdGlvbjogdm0uc29ydC5zb3J0RGlyZWN0aW9ufSwgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEuX2VtYmVkZGVkKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YS5fZW1iZWRkZWQudGFza1Jlc291cmNlTGlzdCwgdGFza0Fzc2VtYmxlclNlcnZpY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGEucGFnZS5udW1iZXIrKztcclxuICAgICAgICAgICAgdm0udGFza3MgPSBkYXRhO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHZtLnJlc2V0RmlsdGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZtLmZpbHRlci5zdGF0ZSA9IFwiYWxsXCI7XHJcbiAgICAgICAgdm0uZmlsdGVyLnN3aW1sYW5lID0gXCJhbGxcIjtcclxuICAgICAgICB2bS5maWx0ZXIuY2F0ZWdvcnkgPSBcImFsbFwiO1xyXG4gICAgICAgIHZtLmZpbHRlci5tZW1iZXIgPSBcImFsbFwiO1xyXG4gICAgICAgIHZtLmNoYW5nZWRGaWx0ZXIoKTtcclxuICAgIH07XHJcbn07XHJcbnRhc2tDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkdWliTW9kYWxcIiwgXCJwcm9qZWN0XCIsIFwidGFza0Fzc2VtYmxlclNlcnZpY2VcIiwgXCJIYXRlb2FzSW50ZXJmYWNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHRhc2tDb250cm9sbGVyOyIsInZhciByZXNvbHZlVGFzayA9IGZ1bmN0aW9uICgkc3RhdGVQYXJhbXMsIHRhc2tTZXJ2aWNlKSB7XHJcbiAgICByZXR1cm4gdGFza1NlcnZpY2UuZ2V0KHtcInByb2plY3RJZFwiOiAkc3RhdGVQYXJhbXMucHJvamVjdElkLCBcInRhc2tJZFwiOiAkc3RhdGVQYXJhbXMudGFza0lkfSk7XHJcbn07XHJcbnJlc29sdmVUYXNrLiRpbmplY3QgPSBbXCIkc3RhdGVQYXJhbXNcIiwgXCJ0YXNrU2VydmljZVwiXTtcclxuXHJcbnZhciBjb25maWcgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiYXBwLnByb2plY3QudGFza3NcIiwge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svbGlzdC5odG1sXCIsXHJcbiAgICAgICAgY29udHJvbGxlcjogXCJ0YXNrbGlzdENvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwidGFza3NDdHJsXCIsXHJcbiAgICAgICAgdXJsOiBcInRhc2tzXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC50YXNrXCIsIHtcclxuICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvcHJvamVjdC90YXNrL3Rhc2suaHRtbFwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFwidGFza0NvbnRyb2xsZXJcIixcclxuICAgICAgICBjb250cm9sbGVyQXM6IFwidGFza0N0cmxcIixcclxuICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgIHRhc2s6IHJlc29sdmVUYXNrXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cmw6IFwidGFzay86dGFza0lkXCJcclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJhcHAucHJvamVjdC50YXNrLmFsbG9jYXRpb25cIiwge1xyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svYWxsb2NhdGlvbi9saXN0Lmh0bWxcIixcclxuICAgICAgICBjb250cm9sbGVyOiBcImFsbG9jYXRpb25MaXN0Q29udHJvbGxlclwiLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogXCJhbGxvY2F0aW9uTGlzdEN0cmxcIixcclxuICAgICAgICB1cmw6IFwiL2FsbG9jYXRpb25cIlxyXG4gICAgfSk7XHJcbn07XHJcbmNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xyXG4iLCJcclxudmFyIHRhc2tDb250cm9sbGVyID0gZnVuY3Rpb24gKCRxLCAkc3RhdGUsICR1aWJNb2RhbCwgcHJvamVjdCwgY3VycmVudHRhc2ssIHRhc2tBc3NlbWJsZXJTZXJ2aWNlLCBhbGxvY2F0aW9uU2VydmljZSwgZ3Jvd2wsIGFwcFBhcmFtZXRlcnMpIHtcclxuICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICB2bS5jdXN0b21GaWVsZE1hcCA9IHt9O1xyXG4gICAgdm0udGFzayA9IGN1cnJlbnR0YXNrO1xyXG5cclxuXHJcbiAgICB2bS5hbGxvY2F0aW9uID0gYWxsb2NhdGlvblNlcnZpY2UubG9hZEFsbG9jYXRpb24oYXBwUGFyYW1ldGVycyk7XHJcbiAgICBwcm9qZWN0LiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGN1cnJlbnR0YXNrLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS50YXNrID0gdGFza0Fzc2VtYmxlclNlcnZpY2UoY3VycmVudHRhc2spO1xyXG4gICAgICAgICAgICB2bS50YXNrLnBhcmVudElkID0gW107XHJcbiAgICAgICAgICAgIHZtLnRhc2suY2hpbGRyZW5JZCA9IFtdO1xyXG5cclxuICAgICAgICAgICAgdm0udGFzay5jaGlsZHJlbiA9IHZtLnRhc2sucmVzb3VyY2UoXCJjaGlsZHJlblwiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICB2bS50YXNrLmNoaWxkcmVuLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnRhc2suY2hpbGRyZW5JZC5wdXNoKGRhdGFbaV0uaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdm0udGFzay5wYXJlbnQgPSB2bS50YXNrLnJlc291cmNlKFwicGFyZW50c1wiKS5xdWVyeSgpO1xyXG4gICAgICAgICAgICB2bS50YXNrLnBhcmVudC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2bS50YXNrLnBhcmVudElkLnB1c2goZGF0YVtpXS5pZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZtLmNhdGVnb3JpZXMgPSBwcm9qZWN0LnJlc291cmNlKFwiY2F0ZWdvcnlcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zdGF0ZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3RhdGVcIikucXVlcnkoKTtcclxuICAgICAgICB2bS5zd2ltbGFuZXMgPSBwcm9qZWN0LnJlc291cmNlKFwic3dpbWxhbmVcIikucXVlcnkoKTtcclxuICAgICAgICB2YXIgY3VzdG9tZmllbGRzID0gcHJvamVjdC5yZXNvdXJjZShcInRhc2tmaWVsZFwiKS5xdWVyeSgpO1xyXG4gICAgICAgICRxLmFsbChbY3VzdG9tZmllbGRzLiRwcm9taXNlLCBjdXJyZW50dGFzay4kcHJvbWlzZV0pLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdm0udGFzay5jdXN0b21GaWVsZCA9IFtdO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YVswXSwgZnVuY3Rpb24gKGN1c3RvbUZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jdXN0b21GaWVsZE1hcFtjdXN0b21GaWVsZC5maWVsZE5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmluaXRpb246IGN1c3RvbUZpZWxkXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdm0udGFzay5jdXN0b21GaWVsZC5wdXNoKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdm0udGFzay5yZXNvdXJjZShcImN1c3RvbWZpZWxkXCIpLnF1ZXJ5KGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGN1c3RvbUZpZWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZGVmaW5pdGlvbi50eXBlID09PSBcIk5VTUJFUlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IHBhcnNlRmxvYXQoY3VzdG9tRmllbGQuZmllbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2bS5jdXN0b21GaWVsZE1hcFtjdXN0b21GaWVsZC5maWVsZE5hbWVdLmRlZmluaXRpb24udHlwZSA9PT0gXCJEQVRFXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VzdG9tRmllbGRNYXBbY3VzdG9tRmllbGQuZmllbGROYW1lXS5maWVsZFZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbUZpZWxkLmZpZWxkVmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IG5ldyBEYXRlKGN1c3RvbUZpZWxkLmZpZWxkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZGVmaW5pdGlvbi5yZXF1aXJlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VzdG9tRmllbGRNYXBbY3VzdG9tRmllbGQuZmllbGROYW1lXS5maWVsZFZhbHVlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmZpZWxkTmFtZV0uZmllbGRWYWx1ZSA9IGN1c3RvbUZpZWxkLmZpZWxkVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICB2bS5hZGRUYXNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9wcm9qZWN0L3Rhc2svYWRkLmh0bWxcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogXCJhZGRUYXNrQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYWRkVGFza0N0cmxcIixcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBcIm1kXCJcclxuICAgICAgICB9KTtcclxuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKHZtLmxvYWRQYWdlKTtcclxuICAgIH07XHJcbiAgICB2bS5zZWxlY3RBc3NpZ25lZSA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICB2YXIgdXNlckFscmVhZHlBc3NpZ25lZCA9IGZhbHNlO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS50YXNrLmFzc2lnbmVlcywgZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgaWYgKHVzZXIuaWQgPT09ICRtb2RlbC5pZCkge1xyXG4gICAgICAgICAgICAgICAgdXNlckFscmVhZHlBc3NpZ25lZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBncm93bC5lcnJvcihcIlV0aWxpc2F0ZXVyIGTDqWrDoCBhc3NpZ27DqVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghdXNlckFscmVhZHlBc3NpZ25lZCkge1xyXG4gICAgICAgICAgICB2bS50YXNrLmFzc2lnbmVlcy5wdXNoKCRtb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZtLnJlbW92ZXVzZXIgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2bS50YXNrLmFzc2lnbmVlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIHZtLmdldE1lbWJlcnMgPSBmdW5jdGlvbiAodGVybSkge1xyXG4gICAgICAgIHJldHVybiBwcm9qZWN0LnJlc291cmNlKFwibWVtYmVyXCIpLnF1ZXJ5KHtzZWFyY2g6IHRlcm19KS4kcHJvbWlzZTtcclxuICAgIH07XHJcbiAgICB2bS5jaGVjaE5vdEFscmVhZHlJblBhcmVudE9yQ2hpbGQgPSBmdW5jdGlvbih0YXNrKXtcclxuICAgICAgICB2YXIgaXNOb3RQcmVzZW50ID0gdHJ1ZTtcclxuICAgICAgICBpZih2bS50YXNrLmNoaWxkcmVuSWQuaW5kZXhPZih0YXNrLmlkKSA+IC0xIHx8dm0udGFzay5wYXJlbnRJZC5pbmRleE9mKHRhc2suaWQpID4gLTEpe1xyXG4gICAgICAgICAgICBpc05vdFByZXNlbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzTm90UHJlc2VudDtcclxuICAgIH07XHJcbiAgICB2bS5hZGRDaGlsZCA9IGZ1bmN0aW9uICgkaXRlbSwgJG1vZGVsLCAkbGFiZWwpIHtcclxuICAgICAgICBpZih2bS5jaGVjaE5vdEFscmVhZHlJblBhcmVudE9yQ2hpbGQoJGl0ZW0pKSB7XHJcbiAgICAgICAgICAgIHZtLnRhc2sucmVzb3VyY2UoXCJjaGlsZHJlblwiKS5xdWVyeSh7bGlua2VkVGFza0lkOiAkaXRlbS5pZH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZtLnRhc2suY2hpbGRyZW4ucHVzaCgkaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB2bS50YXNrLmNoaWxkcmVuSWQucHVzaCgkaXRlbS5pZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2bS5zZWxlY3RlZENoaWxkID0gbnVsbDtcclxuICAgIH07XHJcbiAgICB2bS5hZGRQYXJlbnQgPSBmdW5jdGlvbiAoJGl0ZW0sICRtb2RlbCwgJGxhYmVsKSB7XHJcbiAgICAgICAgaWYodm0uY2hlY2hOb3RBbHJlYWR5SW5QYXJlbnRPckNoaWxkKCRpdGVtKSl7XHJcbiAgICAgICAgICAgIHZtLnRhc2sucmVzb3VyY2UoXCJwYXJlbnRzXCIpLnF1ZXJ5KHtsaW5rZWRUYXNrSWQ6ICRpdGVtLmlkfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdm0udGFzay5wYXJlbnQucHVzaCgkaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB2bS50YXNrLnBhcmVudElkLnB1c2goJGl0ZW0uaWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdm0uc2VsZWN0ZWRQYXJlbnQgPSBudWxsO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgdm0udGFzay5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHZtLnRhc2suY2hpbGRyZW5JZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIHZtLnJlbW92ZVBhcmVudCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgIHZtLnRhc2sucGFyZW50LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgdm0udGFzay5wYXJlbnRJZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfTtcclxuICAgIHZtLmdldFRhc2tzID0gZnVuY3Rpb24gKHRlcm0pIHtcclxuICAgICAgICByZXR1cm4gcHJvamVjdC5yZXNvdXJjZShcInRhc2tcIikucXVlcnkoe2lkVGFzayA6IHZtLnRhc2suaWQsc2VhcmNoOiB0ZXJtfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdFdpdGhvdXREdXBsaWNhdGUgPSBbXTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKyspe1xyXG4gICAgICAgICAgICAgICAgaWYodm0uY2hlY2hOb3RBbHJlYWR5SW5QYXJlbnRPckNoaWxkKGRhdGFbaV0pKXtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRXaXRob3V0RHVwbGljYXRlLnB1c2goZGF0YVtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFdpdGhvdXREdXBsaWNhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdm0uZm9ybWF0TGliZWxsZSA9IGZ1bmN0aW9uKHRhc2spe1xyXG4gICAgICAgIHZhciBsaWJlbGxlID0gJyc7XHJcbiAgICAgICAgaWYodGFzayAhPT0gdW5kZWZpbmVkICYmIHRhc2sgIT09IG51bGwpe1xyXG4gICAgICAgICAgICBsaWJlbGxlID0gJyMnKyB0YXNrLmlkICsgJyAtICcgKyB0YXNrLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaWJlbGxlO1xyXG4gICAgfVxyXG4gICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh2bS50YXNrLmN1c3RvbUZpZWxkLCBmdW5jdGlvbiAoY3VzdG9tRmllbGQpIHtcclxuICAgICAgICAgICAgaWYgKHZtLmN1c3RvbUZpZWxkTWFwW2N1c3RvbUZpZWxkLmRlZmluaXRpb24uZmllbGROYW1lXS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgY3VzdG9tRmllbGQudmFsdWUgPSB2bS5jdXN0b21GaWVsZE1hcFtjdXN0b21GaWVsZC5kZWZpbml0aW9uLmZpZWxkTmFtZV0udmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB2bS50YXNrLnJlc291cmNlKFwic2VsZlwiKS5zYXZlKHZtLnRhc2ssIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhcImFwcC5wcm9qZWN0LmthbmJhblwiLCB7cHJvamVjdElkOiBwcm9qZWN0LmlkfSk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gZXJyb3IuZGF0YTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn07XHJcbnRhc2tDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkcVwiLCBcIiRzdGF0ZVwiLFwiJHVpYk1vZGFsXCIsIFwicHJvamVjdFwiLCBcInRhc2tcIiwgXCJ0YXNrQXNzZW1ibGVyU2VydmljZVwiLCBcImFsbG9jYXRpb25TZXJ2aWNlXCIsIFwiZ3Jvd2xcIiwgXCJhcHBQYXJhbWV0ZXJzXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHRhc2tDb250cm9sbGVyO1xyXG4iLCJ2YXIgY29tbWVudE1vZHVsZSA9IHJlcXVpcmUoXCIuL2NvbW1lbnQvY29tbWVudC5tb2R1bGVcIik7XHJcbnZhciBhbGxvY2F0aW9uTW9kdWxlID0gcmVxdWlyZShcIi4vYWxsb2NhdGlvbi9hbGxvY2F0aW9uLm1vZHVsZVwiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuL3Rhc2suY29uZmlnXCIpO1xyXG52YXIgYWRkVGFza0NvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9hZGQuY29udHJvbGxlclwiKTtcclxudmFyIHRhc2tsaXN0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL2xpc3QuY29udHJvbGxlclwiKTtcclxudmFyIHRhc2tDb250cm9sbGVyID0gcmVxdWlyZShcIi4vdGFzay5jb250cm9sbGVyXCIpO1xyXG52YXIgaGlzdG9Nb2R1bGUgPSByZXF1aXJlKFwiLi9oaXN0b3J5L2hpc3RvcnkubW9kdWxlXCIpO1xyXG52YXIgdGFza1NlcnZpY2UgPSByZXF1aXJlKFwiLi90YXNrLnNlcnZpY2VcIik7XHJcbnZhciB0YXNrQXNzZW1ibGVyU2VydmljZSA9IHJlcXVpcmUoXCIuL3Rhc2tBc3NlbWJsZXIuc2VydmljZVwiKTtcclxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyLm1vZHVsZSgna2FuYmFuLnByb2plY3QudGFzaycsIFtjb21tZW50TW9kdWxlLm5hbWUsIGFsbG9jYXRpb25Nb2R1bGUubmFtZSwgaGlzdG9Nb2R1bGUubmFtZV0pXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJhZGRUYXNrQ29udHJvbGxlclwiLCBhZGRUYXNrQ29udHJvbGxlcilcclxuICAgICAgICAuY29udHJvbGxlcihcInRhc2tsaXN0Q29udHJvbGxlclwiLCB0YXNrbGlzdENvbnRyb2xsZXIpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJ0YXNrQ29udHJvbGxlclwiLCB0YXNrQ29udHJvbGxlcilcclxuICAgICAgICAuc2VydmljZShcInRhc2tTZXJ2aWNlXCIsIHRhc2tTZXJ2aWNlKVxyXG4gICAgICAgIC5zZXJ2aWNlKFwidGFza0Fzc2VtYmxlclNlcnZpY2VcIiwgdGFza0Fzc2VtYmxlclNlcnZpY2UpOyIsInZhciB0YXNrU2VydmljZSA9IGZ1bmN0aW9uICgkcmVzb3VyY2UpIHtcclxuICAgIHJldHVybiAkcmVzb3VyY2UoXCIvYXBpL3Byb2plY3QvOnByb2plY3RJZC90YXNrLzp0YXNrSWRcIiwge3Byb2plY3RJZDogXCJAcHJvamVjdElkXCIsIGlkOiBcIkB0YXNrSWRcIn0pO1xyXG59O1xyXG50YXNrU2VydmljZS4kaW5qZWN0ID0gW1wiJHJlc291cmNlXCJdO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHRhc2tTZXJ2aWNlOyIsInZhciB0YXNrQXNzZW1ibGVyU2VydmljZSA9IGZ1bmN0aW9uICgkaHR0cCwgSGF0ZW9hc0ludGVyZmFjZSwgbW9tZW50KSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhc2spIHtcclxuICAgICAgICB2YXIgdGFza3Jlc291cmNlID0gdGFzaztcclxuICAgICAgICBpZiAoIXRhc2sucmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgdGFza3Jlc291cmNlID0gbmV3IEhhdGVvYXNJbnRlcmZhY2UodGFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhc2suc3RhdGUgPSB0YXNrcmVzb3VyY2UucmVzb3VyY2UoXCJzdGF0ZVwiKS5nZXQoKTtcclxuICAgICAgICBpZiAodGFzay5fbGlua3MuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgdGFzay5jYXRlZ29yeSA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcImNhdGVnb3J5XCIpLmdldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGFzay5fbGlua3Muc3dpbWxhbmUpIHtcclxuICAgICAgICAgICAgdGFzay5zd2ltbGFuZSA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcInN3aW1sYW5lXCIpLmdldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXNrLmFzc2lnbmVlcyA9IHRhc2tyZXNvdXJjZS5yZXNvdXJjZShcImFzc2lnbmVlXCIpLnF1ZXJ5KGZ1bmN0aW9uIChhc3NpZ25lZXMpIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGFzc2lnbmVlcywgZnVuY3Rpb24gKGFzc2lnbmVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzaWduZWUuX2xpbmtzLnBob3RvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0dHAuZ2V0KGFzc2lnbmVlLl9saW5rcy5waG90bykudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2lnbmVlLnBob3RvID0gcmVzdWx0LmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoYXNzaWduZWUuX2xpbmtzLnVzZXIpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbmVlLnVzZXJJZCA9IHJlc3VsdC5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzaWduZWVzO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRhc2suZXhjZWVkZWRMb2FkID0gKHRhc2sudGltZVJlbWFpbnMgKyB0YXNrLnRpbWVTcGVudCA+IHRhc2suZXN0aW1hdGVkTG9hZCk7XHJcbiAgICAgICAgaWYgKHRhc2tyZXNvdXJjZS5wbGFubmVkRW5kaW5nICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB0b2RheSA9IG1vbWVudCgpO1xyXG4gICAgICAgICAgICB0YXNrLnBsYW5uZWRFbmRpbmcgPSBtb21lbnQodGFza3Jlc291cmNlLnBsYW5uZWRFbmRpbmcpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgICB0YXNrLnN0YXRlLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGFzay5leGNlZWRlZERhdGUgPSAodG9kYXkuaXNBZnRlcih0YXNrLnBsYW5uZWRFbmRpbmcsICdkYXknKSAmJiAhdGFzay5zdGF0ZS5jbG9zZVN0YXRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0YXNrcmVzb3VyY2UucGxhbm5lZFN0YXJ0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRhc2sucGxhbm5lZFN0YXJ0ID0gbW9tZW50KHRhc2tyZXNvdXJjZS5wbGFubmVkU3RhcnQpLnRvRGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGFzaztcclxuICAgIH07XHJcbn07XHJcbnRhc2tBc3NlbWJsZXJTZXJ2aWNlLiRpbmplY3QgPSBbXCIkaHR0cFwiLCBcIkhhdGVvYXNJbnRlcmZhY2VcIiwgXCJtb21lbnRcIl07XHJcbm1vZHVsZS5leHBvcnRzID0gdGFza0Fzc2VtYmxlclNlcnZpY2U7Il19
