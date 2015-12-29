/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define(["angular"], function (angular) {
        var consommationService = function () {
            return {
                loadConsommations: function (project, start, end) {
                    return project.resource("member").query(function (data) {
                        angular.forEach(data, function (member) {
                            member.imputations = member.resource("imputation")
                                    .get({start: start.toLocaleDateString(),
                                        end: end.toLocaleDateString()});
                        });
                    });
                },
                groupByWeek: function (entries, days) {
                    var grouped = {
                        weeks: [],
                        entries: entries
                    };
                    var weeks = [];
                    var i = 0;
                    angular.forEach(days, function (day) {
                        if (!weeks[i]) {
                            weeks[i] = [];
                        }
                        weeks[i].push(day);
                        if (day.getDay() === 0 && weeks[i].length > 0) {
                            i++;
                        }
                    });
                    var index = 0;
                    angular.forEach(weeks, function (week) {
                        var weekObj = {
                            id: index,
                            label: week[0].toLocaleDateString() + " au " + week[week.length - 1].toLocaleDateString(),
                            days: week
                        };
                        grouped.weeks.push(weekObj);
                        index++;
                    });
                    angular.forEach(entries, function (entry) {
                        entry.imputations.$promise.then(function () {
                            var groupedImputations = [];
                            angular.forEach(grouped.weeks, function (week) {
                                var timeSpent = 0;
                                angular.forEach(week.days, function (day) {
                                    timeSpent += entry.imputations.imputations[day.getTime()];
                                });
                                groupedImputations[week.id] = timeSpent;
                            });
                            entry.imputations.imputations = groupedImputations;
                            
                            angular.forEach(entry.imputations.details, function (detail) {
                                var groupedDetailsImputation = [];
                                angular.forEach(grouped.weeks, function (week) {
                                    var timeSpent = 0;
                                    angular.forEach(week.days, function (day) {
                                        timeSpent += detail.imputations[day.getTime()];
                                    });
                                    groupedDetailsImputation[week.id] = timeSpent;
                                });
                                detail.imputations = groupedDetailsImputation;
                            });
                        });
                    });
                    console.log(grouped);
                    return grouped;
                }
            };
        };
        consommationService.$inject = [];
        return consommationService;
    });
})();
