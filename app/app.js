angular
    .module('rokort', ['ngAnimate', 'ui.router'])

    .config(function ($stateProvider) {
        $stateProvider
            .state('trips', {
                url: '/',
                template: '<trips></trips>'
            });
    });