
var checkSamePassword = function (password, rePassword) {
    var error = null;
    if (rePassword !== '' &&
            password !== undefined
            && rePassword !== password) {
        error = {};
        error.messages = [
            {message: "Les mots de passe saisis ne correspondent pas"}
        ];
    }
    return error;
};
module.exports = function () {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            password: "=password",
            placeholder: "@placeholder",
            error: "=error"
        },
        link: function (scope, elem, attrs, ctrl) {
            var rePasswordElm = elem.children()[0];
            elem.add(scope.password).on('keyup', function () {
                scope.error = checkSamePassword(scope.password, rePasswordElm.value);
                scope.$apply();
            });
            scope.$watch('password', function () {
                if (rePasswordElm.value) {
                    scope.error = checkSamePassword(scope.password, rePasswordElm.value);
                }
            });
        },
        template: '<input type="password" required="requiered" class="form-control" id="rePassword" placeholder="{{placeholder}}"/>'
    };
};