angular.module('rokort').directive('tripsLog', tripsLog);

function tripsLog(Trips, Settings) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "trips/trips-log.html",
        controllerAs: 'ctrl',
        bindToController: true,
        controller: function () {
            Trips.getAll()
                .then(trips => this.trips = trips);

            this.descriptions = Settings.descriptions;
            this.boats = Settings.boats;

            this.newTrip = {
                rower: Settings.rower,
                boat: this.boats[0].id,
                description: this.descriptions[0],
                distance: Settings.distance
            };

            this.addTrip = function (trip) {
                this.adding = true;

                Trips.addTrip(trip)
                    .then(() => {
                        Trips.getAll()
                            .then((trips) => {
                                this.adding = false;
                                this.trips = trips;
                            })
                    })
            };

            this.deleteTrip = function(id) {
                if (confirm("Delete this trip?")) {
                    // Remove from UI instantly
                    this.trips = this.trips.filter(trip => trip.id !== id);

                    Trips.deleteTrip(id)
                        .then(() => {
                            // Update UI with actual state of rokort (This will re-add the trip to the UI if the trip wasn't deleted on rokort)
                            Trips.getAll()
                                .then((trips) => {
                                    this.trips = trips;
                                })
                        })
                }
            };
        }
    }
}