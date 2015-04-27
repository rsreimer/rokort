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
                var ctrl = this;

                Trips.getAll()
                    .then(function(trips) {
                        ctrl.trips = trips;
                    });

                ctrl.descriptions = Settings.descriptions;
                ctrl.boats = Settings.boats;

                ctrl.newTrip = {
                    rower: Settings.rower,
                    boat: ctrl.boats[0].id,
                    description: ctrl.descriptions[0],
                    distance: Settings.distance
                };

                ctrl.deleteTrip = function(id) {
                    if (confirm("Delete this trip?")) {
                        // Remove from UI instantly
                        ctrl.trips = ctrl.trips.filter(function(trip) {return trip.id !== id});

                        Trips.deleteTrip(id)
                            .then(function() {
                                // Update UI with actual state of rokort (This will re-add the trip to the UI if the trip wasn't deleted on rokort)
                                Trips.getAll()
                                    .then(function(trips) {
                                        ctrl.trips = trips;
                                    })
                            })
                    }
                }
            }
        }
    });