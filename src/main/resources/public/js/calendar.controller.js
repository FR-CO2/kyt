/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

vm.uiConfig = {
    calendar: {
        editable: true,
        lang: 'fr',
        header: {
            left: "title",
            center: "",
            right: "today prev,next"
        },
        dayClick: function (date) {
            $modal.open({
                animation: true,
                templateUrl: "templates/timesheet/day.html",
                controller: "timesheetController",
                controllerAs: "tsCtrl",
                size: "md",
                resolve: {
                    dateTS: function () {
                        return date;
                    }
                }
            });
        }
    }
};

vm.events = [{
        url: "/api/userEvent",
        headers: {
            Authorization: (function () {
                if ($sessionStorage.oauth) {
                    return $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token;
                }
                return "";
            })()
        },
        eventDataTransform: function (event) {
            var eventTransform = {};
            eventTransform.title = event.name;
            eventTransform.start = new Date(event.plannedStart);
            eventTransform.end = new Date(event.plannedEnding);
            if (event.category) {
                var cat = event.category;
                if (cat.color) {
                    eventTransform.color = cat.color;
                }
                if (cat.bgcolor) {
                    eventTransform.backgroundColor = cat.bgcolor;
                }
                eventTransform.url = "#/project/" + event.project.id + "/task/" + event.id + "/general";
            }
            return eventTransform;
        }
    }];


$scope.$on("event:auth-loginConfirmed", function () {
    vm.events[0].headers = {
        Authorization: (function () {
            if ($sessionStorage.oauth) {
                return $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token;
            }
            return "";
        })()
    };
    $scope.userCalendar.fullCalendar('refetchEvents');
});
