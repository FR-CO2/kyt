var editController = function ($state, project) {
    var vm = this;
    vm.project = project;
    $state.transitionTo("app.project.edit.taskfield", {projectId: project.id});
};
editController.$inject = ["$state", "project"];
module.exports = editController;


