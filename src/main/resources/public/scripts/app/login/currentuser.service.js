var userProfile = function ($resource) {
    return $resource("/api/userProfile");
};
userProfile.$inject = ["$resource"];
module.exports = userProfile;
