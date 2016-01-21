/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
require.config({
    paths: {
        jquery: '../../webjars/jquery/2.1.4/jquery.min',
        jqueryui: '../../webjars/jquery-ui/1.11.4/jquery-ui.min',
        bootstrap: '../../webjars/bootstrap/3.3.6/js/bootstrap.min',
        moment: '../../webjars/momentjs/2.5.0/min/moment.min',
        fullcalendar: '../../webjars/fullcalendar/2.4.0/fullcalendar.min',
        fullcalendarfr: '../../webjars/fullcalendar/2.4.0/lang/fr',
        angular: '../../webjars/angularjs/1.4.8/angular.min',
        ngSortable: '../../webjars/ng-sortable/1.1.9/ng-sortable.min',
        ngStorage: '../../webjars/ngStorage/0.3.0/ngStorage.min',
        ngResource: '../../webjars/angularjs/1.4.8/angular-resource.min',
        uiRouter: '../../webjars/angular-ui-router/0.2.15/angular-ui-router.min',
        xeditable: '../../webjars/angular-xeditable/0.1.9/js/xeditable.min',
        ngAuth: '../../webjars/angular-http-auth/1.2.2/http-auth-interceptor',
        ngAnimate: '../../webjars/angularjs/1.4.8/angular-animate.min',
        ngAria: '../../webjars/angularjs/1.4.8/angular-aria.min',
        ngSanitize: '../../webjars/angularjs/1.4.8/angular-sanitize.min',
        hateoas: '../lib/angular-hateoas/angular-hateoas.min',
        uiBootstrap: '../../webjars/angular-ui-bootstrap/0.14.3/ui-bootstrap.min',
        uiBootstrapTpl: '../../webjars/angular-ui-bootstrap/0.14.3/ui-bootstrap-tpls.min',
        uiCalendar: '../lib/angular-ui-calendar/calendar',
        growl: '../../webjars/angular-growl-2/0.7.3/angular-growl.min',
    },
    shim: {
        bootstrap: {
            deps: ["jquery"]
        },
        moment: {
            exports: 'moment'
        },
        fullcalendarfr: {
            deps: ['fullcalendar']
        },
        fullcalendar: {
            deps: ["jquery", "jqueryui", "moment", "angular"],
            exports: 'fullcalendar'
        },
        "jquery": {
            "exports": "$"
        },
        "jqueryui": {
            "deps": ["jquery"]
        },
        angular: {
            "deps": ["jquery", "moment"],
            exports: 'angular'
        },
        ngSortable: {
            deps: ["angular"]
        },
        ngStorage: {
            deps: ["angular"]
        },
        uiRouter: {
            deps: ["angular"]
        },
        ngAnimate: {
            deps: ["angular"]
        },
        ngAria: {
            deps: ["angular"]
        },
        ngSanitize: {
            deps: ["angular"]
        },
        uiBootstrap: {
            deps: ["angular", "bootstrap"]
        },
        uiBootstrapTpl: {
            deps: ["angular", "uiBootstrap"]
        },
        uiCalendar: {
            deps: ["angular", "fullcalendar", "moment"]
        },
        ngAuth: {
            deps: ["angular"]
        },
        xeditable: {
            deps: ["angular"]
        },
        ngResource: {
            deps: ["angular"]
        },
        hateoas: {
            deps: ["angular"]
        },
        growl: {
            deps: ["angular"]
        }
    },
    baseUrl: 'scripts/app',
    deps: ['./app'],
    appDir: "./",
    dir: "./",
    waitSeconds: 200
});



