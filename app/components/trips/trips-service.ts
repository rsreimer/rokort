angular.module("rokort").service("Trips", ($http, Settings, $q) => new Trips($http, Settings, $q));

class Trips {
    constructor (private $http, private Settings, private $q) {}

    getAll = () => {
        return this.$http.get("http://rsreimer.com/andet/rokort/api/profile/" + this.Settings.get("rower").id)
            .then(response => response.data);
    };

    deleteTrip = id => {
        var deferred = this.$q.defer();

        this.$http
            .delete("http://rsreimer.com/andet/rokort/api/trip/" + id)
            .then(() => {
                this.getAll()
                    .then(trips => deferred.resolve(trips));
            });

        return deferred.promise;
    };

    addTrip = trip => {
        var deferred = this.$q.defer();

        this.$http
            .post("http://rsreimer.com/andet/rokort/api/trip", trip)
            .then(() => {
                this.getAll()
                    .then(trips => deferred.resolve(trips));
            });

        return deferred.promise;
    };
}
