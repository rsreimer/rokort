angular
    .module('rokort')
    .controller('TripsController', function($scope, Settings, Trips) {

    Trips.getAll()
        .then(function(trips) {
            $scope.trips = trips;
        })

    $scope.descriptions = Settings.descriptions;
    $scope.boats = Settings.boats;

    $scope.newTrip = {
        rower: Settings.rower,
        boat: $scope.boats[0].id,
        description: $scope.descriptions[0],
        distance: Settings.distance
    }

    $scope.addTrip = function (trip) {
        $scope.adding = true;

        Trips.addTrip(trip)
            .then(function() {
                Trips.getAll()
                    .then(function(trips) {
                        $scope.adding = false;
                        $scope.trips = trips;
                    })
            })
    }

    $scope.deleteTrip = function(id) {
        if (confirm("Delete this trip?")) {
            // Remove from UI instantly
            $scope.trips = $scope.trips.filter(function(trip) {return trip.id !== id});

            Trips.deleteTrip(id)
                .then(function() {
                    // Update UI with actual state of rokort (This will re-add the trip to the UI if the trip wasn't deleted on rokort)
                    Trips.getAll()
                        .then(function(trips) {
                            $scope.trips = trips;
                        })
                })
        }
    }
});