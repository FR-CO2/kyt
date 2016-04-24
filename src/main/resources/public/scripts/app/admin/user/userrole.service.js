var userRoleService = function ($resource) {
    return $resource("/api/role");
};
userRoleService.$inject = ["$resource"];
module.exports = userRoleService;
