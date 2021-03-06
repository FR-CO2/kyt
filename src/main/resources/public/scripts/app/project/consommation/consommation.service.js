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
    } catch (err) {

    }
}

var consommationService = function (allocationService) {
    return {
        loadConsommations: function (project, start, end) {
            return project.resource("member").query(function (data) {
                angular.forEach(data, function (member) {
// need to multipy by 1000 for get UNIX Timestamp
                    member.imputations = member.resource("imputation")
                            .get({start: start.format("X") * 1000,
                                end: end.format("X") * 1000});
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
                        if (entry.imputations.imputations[i].valImputation !== parseInt(allocations.max) &&
                                convertStringToDate(entry.imputations.imputations[i].imputationDate) < new Date()) {
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