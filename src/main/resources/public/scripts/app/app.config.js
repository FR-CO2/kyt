
function authTokenHttpInterceptor($sessionStorage) {
    return {
        "request": function (config) {
            if (config.url && config.url.indexOf(".html") === -1 && $sessionStorage.oauth) {
                config.headers.authorization = $sessionStorage.oauth.token_type + " " + $sessionStorage.oauth.access_token;
                config.withCredentials = true;
            }
            return config;
        }
    };
}
;
authTokenHttpInterceptor.$inject = ["$sessionStorage"];

var config = function ($stateProvider, $httpProvider, HateoasInterceptorProvider) {
    $stateProvider.state("app", {
        abstract: true,
        templateUrl: "layout-app.html",
        controller: "appController",
        controllerAs: "appCtrl",
        url: "/",
        resolve: {
            currentuser: ["currentUserService", function (currentUserService) {
                    return currentUserService.get();
                }],
            appParameters : [ "parameterService", function (parameterService) {
                    return parameterService.query();
            }]
        }
    });
    $stateProvider.state("app.dashboard", {
        templateUrl: "templates/dashboard/dashboard.html",
        controller: "dashboardController",
        controllerAs: "dashboardCtrl",
        url: "dashboard"
    });
    $stateProvider.state("app.profil", {
        templateUrl: "templates/profil/profil.html",
        controller: "profilController",
        controllerAs: "profilCtrl",
        url: "profil"
    });
    $stateProvider.state("login", {
        templateUrl: "login.html",
        controller: "loginController",
        controllerAs: "login",
        url: "/login"
    });
    $httpProvider.interceptors.push(authTokenHttpInterceptor);
    HateoasInterceptorProvider.transformAllResponses();
};
config.$inject = ["$stateProvider", "$httpProvider", "HateoasInterceptorProvider"];

module.exports = config;

