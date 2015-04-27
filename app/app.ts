angular
    .module('rokort', ['ngAnimate', 'ui.router'])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('trips', {
                url: '/',
                template: '<add-trip-form></add-trip-form> <trips-log></trips-log>'
            });

        $urlRouterProvider.otherwise('/');
    });