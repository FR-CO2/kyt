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

            gotoOrderDetails = function (id) {
                window.location = "/orders/" + id;
            },

            _renderItem = function (ul, item) {
                return $("<li>")
                    .data("item.autocomplete", item)
                    .append("<span ng-click='tsCtrl.addTask("+item.id+")'>" + item.name + "</span>")
                    .appendTo(ul);
            },

            select = function (event, ui) {
                if (ui.item) {
                    gotoOrderDetails(ui.item.orderId);
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
    
    function timesheetController(taskResource, dateTS) {
        var vm = this;
        vm.dateTS = dateTS;
        vm.tasks = taskResource.userDay({day: dateTS.getTime()});
        vm.assignation = {};
        vm.submit = function() {
            var keys = Object.keys(vm.assignation);
            var assignationSum = 0;
            for (var i = 0; i < keys.length; i++) {
                assignationSum += vm.assignation[keys[i]].timespend;
            }
            if (assignationSum > 10) {
                vm.formError = "Les temps saisis sur une journée ne peut excéder 10";
            }
        };
        
        vm.loadOthersUserTask = function() {
            vm.othersTask = taskResource.user();
        };
        
        vm.addTask =function(task){
            console.log("test");
            vm.tasks.push(task);
        };
    }

    timesheetController.$inject = ["taskResource", "dateTS"];
    autoCompleteCtrl.$inject = ["$scope", "$http"];
    
    angular.module("kaban.timesheet", [])
            .controller("timesheetController", timesheetController)
            .controller("autoCompleteCtrl", autoCompleteCtrl)
            .directive('uiAutocomplete', uiAutocomplete);
})();