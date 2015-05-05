angular.module("rokort")
    .service("Rower", ($http, Settings) => new Rower($http, Settings));

class Rower {
    constructor(private $http, private Settings) { }

    getAll() {
        return this.$http
            .get("http://rsreimer.com/andet/rokort/api/rower")
            .then(response => response.data);
    }

    get() {
        return this.Settings.get("rower");
    }

    set(rower) {
        this.Settings.set("rower", rower);
    }
}
