angular.module('rokort').service('Trips', Trips);

function Trips($http, Settings) {
    var host = 'http://rsreimer.com/andet/rokort/';

    return {
        getAll: function () {
            return $http.get(host + 'api/profile/' + Settings.rower)
                .then(function(response) {
                    return response.data;
                })
        },
        deleteTrip: function (id) {
            return $http.delete(host + 'api/trip/' + id)
        },
        addTrip: function (trip) {
            return $http.post(host + 'api/trip', trip)
        }
    }
}