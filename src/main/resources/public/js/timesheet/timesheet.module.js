(function () {

    function uiAutocomplete () {
	return {
            require: '?ngModel',
            link: function(scope, element, attrs, controller) {
                var getOptions = function() {
                        return angular.extend({}, scope.$eval(attrs.uiAutocomplete));
                };
                var initAutocompleteWidget = function () {
                        var opts = getOptions();
                        element.autocomplete(opts);
                        if (opts._renderItem) {
                                element.data("ui-autocomplete")._renderItem = opts._renderItem;
                        }
                };
                // Watch for changes to the directives options
                scope.$watch(getOptions, initAutocompleteWidget, true);
            }
	};
    };
    
    function autoCompleteCtrl($scope, $http) {
        var search = function(request, response) {
            var callback = function(data) {
                response(data);
            };
            $http({"method": "GET", "url": "/api/userTask/search/"+$scope.tsCtrl.dateTS.getTime()+"/"+$scope.term})
                .success(callback);
        },

        _renderItem = function (ul, item) {
            return $("<li>")
                .data("item.autocomplete", item)
                .append("<span ng-click='tsCtrl.addTask("+item.id+")'>" + item.name + "</span>")
                .appendTo(ul);
        },

        select = function (event, ui) {
            if (ui.item) {
                $scope.tsCtrl.addTask(ui.item); // a vérifier
            }
        };

        $scope.autocompleteOptions = {
            minLength: 1,
            source: search,
            select: select,
            delay: 500,
            _renderItem: _renderItem
        };
    };
    
    function timesheetController($scope, taskResource,allocationResource, dateTS) {
        var vm = this;
        vm.dateTS = dateTS;
        vm.tasks = taskResource.userDay({day: dateTS.getTime()});
        vm.assignation = {};
        vm.submit = function() {
            var keys = Object.keys(vm.assignation);
            var assignationSum = 0;
            var mapTimespent = new Map();
            var mapTimeremains = new Map();
            var mapAllocationId = new Map();
            for (var i = 0; i < keys.length; i++) {
                assignationSum += vm.assignation[keys[i]].timespend;
                mapTimespent.set(parseInt(keys[i]), vm.assignation[keys[i]].timeSpent);
                mapTimeremains.set(parseInt(keys[i]), vm.assignation[keys[i]].timeRemains);
                mapAllocationId.set(parseInt(keys[i]), vm.assignation[keys[i]].allocationId);
            }
            if (assignationSum > 10) {
                vm.formError = "Les temps saisis sur une journÃ©e ne peut excÃ©der 10";
            } else{
                for(i = 0; i < vm.tasks.length; i++){
                    vm.tasks[i].timeSpent = parseFloat(mapTimespent.get(vm.tasks[i].id));
                    vm.tasks[i].timeRemains = parseFloat(mapTimeremains.get(vm.tasks[i].id));
                    vm.tasks[i].allocationId = parseFloat(mapAllocationId.get(vm.tasks[i].id));
                    allocationResource.save({"projectId": vm.tasks[i].project.id}, vm.tasks[i]);
                }
            }
        };
        
        vm.loadOthersUserTask = function() {
            vm.othersTask = taskResource.user();
        };
        
        vm.addTask =function(task){
            vm.tasks.push(task);
            $scope.$apply();
        };
    }

    timesheetController.$inject = ["$scope", "taskResource", "allocationResource", "dateTS"];
    autoCompleteCtrl.$inject = ["$scope", "$http"];
    
    angular.module("kaban.timesheet", [])
            .controller("timesheetController", timesheetController)
            .controller("autoCompleteCtrl", autoCompleteCtrl)
            .directive('uiAutocomplete', uiAutocomplete);
})();