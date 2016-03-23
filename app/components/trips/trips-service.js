angular.module("rokort").service("Trips", function ($http, $q, Settings) {
    var trips = this;

    trips.getAll = function () {
        var deferred = $q.defer();

        $http
            .get("http://rsreimer.com/andet/rokort/api/profile/" + Settings.rower)
            .then(function (response) {
                deferred.resolve(response.data);
            });

        return deferred.promise;
    };

    trips.deleteTrip = function (id) {
        var deferred = $q.defer();

        $http
            .delete("http://rsreimer.com/andet/rokort/api/trip/" + id)
            .then(function () {
                trips.getAll().then(function (trips) {
                    deferred.resolve(trips);
                });
            });

        return deferred.promise;
    };

    this.addtrip = function (trip) {
        var deferred = this.$q.defer();

        $http
            .post("http://rsreimer.com/andet/rokort/api/trip", trip)
            .then(function () {
                trips.getAll().then(function (trips) {
                    deferred.resolve(trips);
                });
            });

        return deferred.promise;
    };
});
