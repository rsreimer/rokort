angular
    .module('rokort')
    .service('Trips', function($http, Settings) {
    return {
        getAll: function () {
            return $http.get('api/profile/' + Settings.rower)
                .then(function(response) {
                    return response.data;
                })
        },
        deleteTrip: function (id) {
            return $http.delete('api/trip/' + id)
        },
        addTrip: function (trip) {
            return $http.post('api/trip', trip)
        }
    }
});