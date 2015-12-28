(function () {
    define([], function () {
        var consommationFactory = function () {
            return {
                filter : {
                    start : new Date(),
                    end : new Date()
                }
            };
        };
        return consommationFactory;
    });
})();