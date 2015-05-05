angular.module('rokort').service('Trips', Trips);

function Trips($http, Settings, $q) {
    var service = {};

    service.getAll = () => {
        return $http.get('http://rsreimer.com/andet/rokort/api/profile/' + Settings.get('rower').id)
            .then(response => response.data);
    };

    service.deleteTrip = id => {
        var deferred = $q.defer();

        $http
            .delete('http://rsreimer.com/andet/rokort/api/trip/' + id)
            .then(() => {
                this.getAll()
                    .then(trips => deferred.resolve(trips))
            });

        return deferred.promise;
    };

    service.addTrip = trip => {
        var deferred = $q.defer();

        $http
            .post('http://rsreimer.com/andet/rokort/api/trip', trip)
            .then(() => {
                this.getAll()
                    .then(trips => deferred.resolve(trips))
            });

        return deferred.promise;
    };
}