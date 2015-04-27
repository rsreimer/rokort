angular.module('rokort').service('Rowers', ($http) => new Rowers($http));

class Rowers {
    constructor(private $http) { }

    getAll() {
        return this.$http
            .get('api/profile/')
            .then(response => response.data);
    }
}