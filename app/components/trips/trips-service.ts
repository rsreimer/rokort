angular.module('rokort').service('Trips', Trips);

function Trips($http, Settings) {
    return {
        getAll: function () {
            return $http.get('http://rsreimer.com/andet/rokort/api/profile/' + Settings.get('rower').id)
                .then(function(response) {
                    return response.data;
                })
        },
        deleteTrip: function (id) {
            return $http.delete('http://rsreimer.com/andet/rokort/api/trip/' + id)
        },
        addTrip: function (trip) {
            return $http.post('http://rsreimer.com/andet/rokort/api/trip', trip)
        }
    }
}