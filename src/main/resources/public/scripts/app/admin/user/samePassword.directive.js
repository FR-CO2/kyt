(function () {
    define([], function () {
        return function () {
            return {
                restrict: "E",
                scope : false,
                link: function (scope, elem, attrs, ctrl) {
                    elem.add(scope.password).on('keyup', function () {
                        if(this.children[0].value !== '' && 
                                scope.addUserAdminCtrl.user.password !== undefined
                                && this.children[0].value !== scope.addUserAdminCtrl.user.password){
                            var form = {error: "Your password does not match"};
                            scope.addUserAdminCtrl.form = form;
                            scope.$apply();
                        }else{
                            var form = {error: null};
                            scope.addUserAdminCtrl.form = form;
                            scope.$apply();
                        }
                    });
                },
                template: '<input type="password" required class="form-control" id="rePassword" placeholder="Rewrite your password"/>'
            };
        };
    });
})();
