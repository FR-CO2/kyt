var userService = function ($resource) {
    return $resource("/api/user");
};
userService.$inject = ["$resource"];
module.exports = userService;
