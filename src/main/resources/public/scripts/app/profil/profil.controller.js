(function () {
    define([], function () {
        var profilController = function (currentuser) {
            var vm = this;
            currentuser.$promise.then(function () {
                vm.profil = currentuser;
                if (currentuser._links.member) {
                    vm.profil.members = currentuser.resource("member").query();
                }
            });
            vm.save = function () {
                if (!vm.error) {
                    currentuser.resource("self").save(vm.profil);
                }
            };
        };
        profilController.$inject = ["currentuser"];
        return profilController;
    });
})();