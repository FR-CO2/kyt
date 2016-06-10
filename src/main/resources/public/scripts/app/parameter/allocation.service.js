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
