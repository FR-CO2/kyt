var parameterService = function ($resource) {
    return $resource("/api/parameter/:category/:key", {category: "@category", key: "@keyParam"});
};
parameterService.$inject = ["$resource"];
module.exports = parameterService;
