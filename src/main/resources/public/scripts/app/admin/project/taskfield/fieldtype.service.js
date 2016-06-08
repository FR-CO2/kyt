var fieldTypeService = function ($resource) {
    return $resource("/api/taskfieldtype");
};
fieldTypeService.$inject = ["$resource"];
module.exports = fieldTypeService;