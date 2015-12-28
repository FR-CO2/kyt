/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    define(["angular"], function (angular) {
        var consommationService = function () {
            return function (project, start, end) {
                return project.resource("member").query(function (data) {
                    angular.forEach(data, function (member) {
                        member.imputations = member.resource("imputation")
                                .get({start: start.toLocaleDateString(),
                                    end: end.toLocaleDateString()});
                    });
                });
            };
        };
        consommationService.$inject = [];
        return consommationService;
    });
})();
