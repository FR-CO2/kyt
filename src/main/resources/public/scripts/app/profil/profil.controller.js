(function () {
    define([], function () {
        var profilController = function (currentuser) {
            var vm = this;
            vm.profil = currentuser;
            if (currentuser._links.member) {
                vm.profil.members = currentuser.resource("member").query();
            }
        };
        profilController.$inject = ["currentuser"];
        return profilController;
    });
})();