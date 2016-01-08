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
                                    .get({start: start.format("X"),
                                        end: end.format("X")});
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
                        if (!weeks[day.weekYear()]) {
                            weeks[day.weekYear()] = [];
                        }
                        weeks[day.weekYear()].push(day);
                    });
                    angular.forEach(weeks, function (week) {
                        var weekObj = {
                            id: week[0].weekYear(),
                            label: week[0].format("DD/MM/YYYY") + " au " + week[week.length - 1].format("DD/MM/YYYY"),
                            days: week
                        };
                        grouped.weeks.push(weekObj);
                    });
                    angular.forEach(entries, function (entry) {
                        entry.imputations.$promise.then(function () {
                            var groupedImputations = [];
                            angular.forEach(grouped.weeks, function (week) {
                                var timeSpent = 0;
                                angular.forEach(week.days, function (day) {
                                    timeSpent += entry.imputations.imputations[day.format("X")];
                                });
                                groupedImputations[week.id] = timeSpent;
                            });
                            entry.imputations.imputations = groupedImputations;
                            
                            angular.forEach(entry.imputations.details, function (detail) {
                                var groupedDetailsImputation = [];
                                angular.forEach(grouped.weeks, function (week) {
                                    var timeSpent = 0;
                                    angular.forEach(week.days, function (day) {
                                        timeSpent += detail.imputations[day.format("X")];
                                    });
                                    groupedDetailsImputation[week.id] = timeSpent;
                                });
                                detail.imputations = groupedDetailsImputation;
                            });
                        });
                    });
                    return grouped;
                }
            };
        };
        consommationService.$inject = [];
        return consommationService;
    });
})();
