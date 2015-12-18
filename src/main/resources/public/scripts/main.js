/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


require.config({
    paths: {
        angular: '../../webjars/angularjs/1.4.8/angular',
        bootstrap: '../../webjars/bootstrap/3.3.6/js/bootstrap',
        jquery: '../../webjars/jquery/2.1.4/jquery',
        ngSortable: '../../webjars/ng-sortable/1.1.9/ng-sortable',
        ngStorage: '../../webjars/ngStorage/0.3.0/ngStorage',
        ngResource: '../../webjars/angularjs/1.4.8/angular-resource',
        uiRouter: '../../webjars/angular-ui-router/0.2.15/angular-ui-router',
        xeditable: '../../webjars/angular-xeditable/0.1.9/js/xeditable',
        ngAuth: '../../webjars/angular-http-auth/1.2.2/http-auth-interceptor',
        ngAnimate: '../../webjars/angularjs/1.4.8/angular-animate',
        ngAria: '../../webjars/angularjs/1.4.8/angular-aria',
        ngSanitize: '../../webjars/angularjs/1.4.8/angular-sanitize',
        hateoas: '../lib/angular-hateoas/angular-hateoas',
        uiBootstrap: '../../webjars/angular-ui-bootstrap/0.14.3/ui-bootstrap',
        uiBootstrapTpl: '../../webjars/angular-ui-bootstrap/0.14.3/ui-bootstrap-tpls'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        bootstrap : {
            deps : [ "jquery" ] 
        },
        "jquery": { 
            "exports": "$" 
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
            deps: ["angular"]
        },
        uiBootstrapTpl: {
            deps: ["angular", "uiBootstrap"]
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
        }
    },
    baseUrl: '/scripts/app',
    deps: ['./app']
});




