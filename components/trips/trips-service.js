angular.module("rokort").service("Trips", function ($http, $q, Settings) {
    var trips = this;

    trips.getAll = function () {
        var deferred = $q.defer();

        $http
            .get("./api/profile/" + Settings.rower)
            .then(function (response) {
                deferred.resolve(response.data);
            });

        return deferred.promise;
    };

    trips.deleteTrip = function (id) {
        var deferred = $q.defer();

        $http
            .delete("./api/trip/" + id)
            .then(function () {
                trips.getAll().then(function (trips) {
                    deferred.resolve(trips);
                });
            });

        return deferred.promise;
    };

    this.addTrip = function (trip) {
        var deferred = $q.defer();

        $http
            .post("./api/trip", trip)
            .then(function () {
                trips.getAll().then(function (trips) {
                    deferred.resolve(trips);
                });
            });

        return deferred.promise;
    };
});
