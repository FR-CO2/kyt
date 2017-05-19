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
        project = currentuser.resource("project").query({taskId: $model.id}).$promise;
        project.then(function () {
            $state.transitionTo("app.project.task", ({projectId: project.$$state.value[0].id, taskId: $model.id}));
        });
        vm.searchedTask = '';
    };
    vm.getTasks = function (term) {
        return currentuser.resource("search").query({search: term}).$promise;
    };
    vm.libelleResearch = function(task){
        var libelle = '';
        if(task !== undefined && task !== ''){
            libelle = '#' + task.id + ' - ' + task.name;
        }
        return libelle;
    }
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
