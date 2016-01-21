(function () {
    define(["angular"], function (angular) {


        var profilController = function (scope, $http, currentuser) {
            var vm = this;
            currentuser.$promise.then(function () {
                vm.profil = currentuser;
                if (currentuser._links.member) {
                    vm.profil.members = currentuser.resource("member").query();
                }
            });
            var handleFileSelect = function (evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    scope.$apply(function () {
                        vm.profil.photo = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
            };
            angular.element(document.querySelector('#photo')).on('change', handleFileSelect);
            vm.save = function () {
                if (!vm.error) {
                    var formData = new FormData();
                    angular.forEach(vm.profil, function (value, key) {
                        if (typeof value !== "function") {
                            formData.append(key, value);
                        }
                    });
                    $http({
                        method: "POST",
                        url: currentuser._links.self,
                        data: formData,
                        headers: {'Content-Type': undefined},
                        transformRequest: angular.identity
                    });
                }
            };
        };
        profilController.$inject = ["$scope", "$http", "currentuser"];
        return profilController;
    });
})();