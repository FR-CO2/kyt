(function () {
    define([], function () {
        var fieldTypeService = function ($resource) {
            return $resource("/api/taskfieldtype");
        };
        fieldTypeService.$inject = ["$resource"];
        return fieldTypeService;
    });
})();