module.exports = function () {
    return {
        restrict: "E",
        transclude: true,
        scope: {filterTitle: '@'},
        template:   '<div class="checkboxDropdown">'
                    +'<button class="btn btn-sm" ng-click="toggle()"> {{filterTitle}} <span class="caret"></span></button>'
                    +'<div class="checkboxDropdown__filters" ng-class="{\'checkboxDropdown__filters--show\': toggled}"><ng-transclude></ng-transclude></div>'
                    +'</div>',
        link: function (scope, elem, attrs) {
            scope.toggled = false;
            scope.toggle = function () {
                scope.toggled = !scope.toggled;
            }
        }
    };
};