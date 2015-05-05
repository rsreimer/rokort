angular.module("rokort")
    .service("Boat", (Settings) => new Boat(Settings));

class Boat {
    constructor(private Settings) { }

    getAll() {
        return [].concat(this.Settings.get("boats"));
    }

    add(boat) {
        this.Settings.set("boats",
            this.getAll().push(boat)
        );
    }

    remove(boat) {
        this.Settings.set("boats",
            this.getAll().filter(d => d !== boat)
        );
    }
}
