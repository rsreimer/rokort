angular.module("rokort")
    .controller("trips", function tripsLog(Trips, Settings, $mdDialog) {
        var ctrl = this;

        ctrl.adding = false;
        ctrl.trips = [];

        ctrl.descriptions = Settings.descriptions;
        ctrl.boats = Settings.boats;
        ctrl.maxDistance = Settings.maxDistance;

        ctrl.newTrip = {
            distance: Settings.distance,
            description: ctrl.descriptions[0],
            boat: ctrl.boats[0].id
        };

        Trips.getAll()
            .then(function (trips) {
                ctrl.trips = trips;
            });

        ctrl.addTrip = function (trip) {
            ctrl.adding = true;

            Trips
                .addTrip(trip)
                .then(function (trips) {
                    ctrl.adding = false;
                    ctrl.trips = trips;
                });
        };

        ctrl.deleteTrip = function (id) {
            var confirm = $mdDialog.confirm()
                .title('Delete this trip?')
                .ok('Yes')
                .cancel('Cancel');

            $mdDialog.show(confirm)
                .then(function() {
                    // Remove from UI instantly
                    ctrl.trips = ctrl.trips.filter(function (trip) {
                        return trip.id !== id;
                    });

                    Trips
                        .deleteTrip(id)
                        .then(function (trips) {
                            ctrl.trips = trips;
                        });
                });
        };
    });


