angular.module('rokort').directive('addTripForm', addTripForm);

function addTripForm(Settings, Trips) {
    return {
        restrict: 'E',
        scope: {},
        bindToController: true,
        templateUrl: "trips/add-trip-form.html",
        controllerAs: "ctrl",
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
                            .then(trips => {
                                this.adding = false;
                                this.trips = trips;
                            })
                    })
            }
        }
    }
}

