var histoService = function ($http, HateoasInterface, moment) {
    return function (histoTask) {
        if(histoTask._links.project){
            histoTask.projectNameChecked = false ;
            $http.get(histoTask._links.project).then(function(data){
                if (histoTask.projectName === data.name) {
                    histoTask.projectNameChecked = true;
                }
            });
        }
        if(histoTask._links.state){
            histoTask.stateNameChecked = false ;
            $http.get(histoTask._links.state).then(function(state){
                if (histoTask.stateName === state.data.name) {
                    histoTask.stateNameChecked = true;
                }
            });
        }
        if(histoTask._links.assignee){
            histoTask.assigneeNameChecked = false ;
            $http.get(histoTask._links.assignee).then(function(assignee){
                if (histoTask.assigneeName === assignee.data.name) {
                    histoTask.assigneeNameChecked = true;
                }
            });
        }
        if(histoTask._links.category) {
            histoTask.categoryNameChecked = false ;
            $http.get(histoTask._links.category).then(function(category){
                if (histoTask.categoryName === category.data.name) {
                    histoTask.categoryNameChecked = true;
                }
            });
        }
        if(histoTask._links.swimlane){
            histoTask.swimlaneNameChecked = false ;
            $http.get(histoTask._links.swimlane).then(function(swimlane){
                if (histoTask.swimlaneName === swimlane.data.name) {
                    histoTask.swimlaneNameChecked = true;
                }
            });
        }
        return histoTask;
    };
}

histoService.$inject = ["$http", "HateoasInterface", "moment"];
module.exports = histoService;
