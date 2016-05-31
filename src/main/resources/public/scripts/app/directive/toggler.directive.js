
module.exports = function () {
    return {
        restrict: "A",
        scope: {
            toggleClass: '@',
            toggleActive: '='
        },
        link: function (scope, elem) {
            if (scope.toggleActive) {
                angular.element(elem).on('click', function () {
                    angular.element(elem).parent().toggleClass(scope.toggleClass);
                });
            }
        }
    };
};