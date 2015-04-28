angular.module('rokort').directive('tripsLog', tripsLog);

function tripsLog(Trips, Settings, Rower) {
    return {
        templateUrl: "trips/trips-log.html",
        restrict: 'E',
        scope: {},
        bindToController: true,
        controllerAs: 'ctrl',
        controller: function () {
            Trips.getAll()
                .then(trips => this.trips = trips);

            this.descriptions = Settings.get('descriptions');
            this.boats = Settings.get('boats');
            this.maxDistance = Settings.get('maxDistance');

            this.newTrip = {
                rower: Rower.get(),
                description: "",
                distance: Settings.get('distance')
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