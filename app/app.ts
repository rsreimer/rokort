angular
    .module('rokort', ['ngAnimate', 'ngSanitize', 'ui.router', 'ui.select'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('welcome', {
                url: '/',
                template: '<rower-picker></rower-picker>'
            })
            .state('trips', {
                url: '/trips',
                template: '<add-trip-form></add-trip-form> <trips-log></trips-log>'
            });

        $urlRouterProvider.otherwise('/');
    });