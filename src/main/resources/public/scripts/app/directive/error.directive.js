module.exports = function () {
    return {
        restrict: "E",
        scope: {
            errors: "=errors"
        },
        template: '<ul> '
                + '<li ng-repeat="msg in errors.messages">'
                + '{{msg.message}}'
                + '</li>'
                + '</ul>'
    };
};
