var app = angular.module('rokort', ['ngAnimate']);

app.service('Settings', function() {
    return {
        rower: 358,
        distance: 10,
        boats: [{id:'1033', name:'Det røde lyn'}, {id: '30', name:'Polokajak'}],
        descriptions: ['Havnen', 'Handicap', 'Kajakpolo', 'Den permanente', '10 km mærket']
    }
});

app.service('Trips', function($http, Settings) {
    return {
        getAll: function () {
            return $http.get('api/profile/' + Settings.rower)
                .then(function(response) {
                    return response.data;
                })
        },
        deleteTrip: function (id) {
            return $http.delete('api/trip/' + id)
        },
        addTrip: function (trip) {
            return $http.post('api/trip', trip)
        }
    }
});

app.controller('TripsController', function($scope, Settings, Trips) {
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

app.directive('longpress', function() {
    return {
        scope: {
            longpress: '&'
        },
        link: function(scope, element) {
            var timer;
            element = element[0];

            function start() {
                timer = setTimeout(function() {
                    scope.longpress();
                    element.classList.remove("long-press");
                }, 500);

                element.classList.add("long-press");
            }

            function end() {
                clearTimeout(timer);
                element.classList.remove("long-press");
            }

            element.addEventListener('touchstart', start);
            element.addEventListener('touchend', end);
            element.addEventListener('mousedown', start);
            element.addEventListener('mouseup', end);
        }
    }
});