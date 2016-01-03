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
                    error: "=error"
                },
                link: function (scope, elem, attrs, ctrl) {
                    elem.add(scope.password).on('keyup', function () {
                        scope.error = checkSamePassword(scope.password, this.children[0].value);
                        scope.$apply();
                    });
                },
                template: '<input type="password" class="form-control" id="rePassword" placeholder="Rewrite your password"/>'
            };
        };
    });
})();
