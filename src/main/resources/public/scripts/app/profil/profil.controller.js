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
                vm.profil.photoTemp = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#photoProfil')).on('change', handleFileSelect);
    vm.save = function () {
        if (!vm.error) {
            var formData = new FormData();
            formData.append("id", vm.profil.id);
            if (vm.profil.password !== undefined) {
                formData.append("password", vm.profil.password);
            }
            formData.append("email", vm.profil.email);
            formData.append("photo", vm.profil.photo);
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

module.exports = profilController;