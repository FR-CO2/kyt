(function () {
    define([], function () {
        var checkSamePassword = function (password, rePassword) {
            var error = null;
            if (rePassword !== '' &&
                    password !== undefined
                    && rePassword !== password) {
                error = {
                    message: "Les mots de passe saisis ne correspondent pas"
                };
            }
            return error;
        };
        return function () {
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
                template: '<input type="password" class="form-control" id="rePassword" placeholder="{{placeholder}}"/>'
            };
        };
    });
})();
