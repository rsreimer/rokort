angular
    .module('rokort')
    .directive('tripsLog', function(Settings, Trips) {
        return {
            restrict: 'E',
            scope: {
            },
            bindToController: true,
            templateUrl: "/app/components/trips/trips-log.html",
            controllerAs: "ctrl",
            controller: function () {
                Trips.getAll()
                    .then(trips => this.trips = trips);

                this.deleteTrip = function(id) {
                    if (confirm("Delete this trip?")) {
                        // Remove from UI instantly
                        this.trips = this.trips.filter(trip => trip.id !== id);

                        Trips.deleteTrip(id)
                            .then(() => {
                                // Update UI with actual state of rokort (This will re-add the trip to the UI if the trip wasn't deleted on rokort)
                                Trips.getAll()
                                    .then(trips => this.trips = trips)
                            })
                    }
                }
            }
        }
    });