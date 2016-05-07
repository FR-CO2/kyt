
module.exports = function () {
    return {
        restrict: "A",
        scope: {
            toggleClass: '@toggleClass'
        },
        link: function (scope, elem) {
            angular.element(elem).on('click', function () {
                angular.element(elem).parent().toggleClass(scope.toggleClass);
            });
        }
    };
};