angular.module('rokort').directive('tripsLog', tripsLog);

function tripsLog(Trips, Settings) {
    return {
        templateUrl: "trips/trips-log.html",
        restrict: 'E',
        scope: {},
        bindToController: true,
        controllerAs: 'ctrl',
        controller: function ($scope) {
            $scope.$watch('ctrl.rower', () => {
                Trips
                    .getAll()
                    .then(trips => this.trips = trips);
            });

            this.descriptions = Settings.get('descriptions');
            this.boats = Settings.get('boats');
            this.maxDistance = Settings.get('maxDistance');

            this.newTrip = {
                boat: null,
                description: "",
                distance: Settings.get('distance')
            };

            this.addTrip = function (trip) {
                this.adding = true;

                Trips
                    .addTrip(trip)
                    .then(trips => {
                        this.adding = false;
                        this.trips = trips;
                    })
            };

            this.deleteTrip = function(id) {
                if (confirm("Delete this trip?")) {
                    // Remove from UI instantly
                    this.trips = this.trips.filter(trip => trip.id !== id);

                    Trips
                        .deleteTrip(id)
                        .then(trips => this.trips = trips);
                }
            };
        }
    }
}