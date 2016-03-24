angular.module("rokort")
    .controller("trips", function tripsLog(Trips, Settings) {
        var ctrl = this;

        ctrl.adding = false;
        ctrl.trips = [];

        ctrl.descriptions = Settings.descriptions;
        ctrl.boats = Settings.boats;
        ctrl.maxDistance = Settings.maxDistance;

        ctrl.newTrip = {
            distance: Settings.distance
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
            if (!confirm("Delete this trip?")) return;

            // Remove from UI instantly
            ctrl.trips = ctrl.trips.filter(function (trip) {
                return trip.id !== id;
            });

            Trips
                .deleteTrip(id)
                .then(function (trips) {
                    ctrl.trips = trips;
                });
        };
    });


