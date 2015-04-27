angular
    .module('rokort')
    .directive('addTripForm', function(Settings, Trips) {
        return {
            restrict: 'E',
            scope: {
            },
            bindToController: true,
            templateUrl: "/app/components/trips/add-trip-form.html",
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

                ctrl.addTrip = function (trip) {
                    ctrl.adding = true;

                    Trips.addTrip(trip)
                        .then(function() {
                            Trips.getAll()
                                .then(function(trips) {
                                    ctrl.adding = false;
                                    ctrl.trips = trips;
                                })
                        })
                }
            }
        }
    });

