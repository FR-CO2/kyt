
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
            error: "=error",
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
        template: function(element, attrs) {
            var htmlText = '<input type="password" ';
            var required = attrs.required;
            var placeholder = attrs.placeholder;
            if(required === "required"){
                htmlText += 'required="required" ';
            }
            htmlText += 'class="form-control" id = "rePassword" placeholder = "' + placeholder+ '" / > ';
            return htmlText;
        }
    };
};