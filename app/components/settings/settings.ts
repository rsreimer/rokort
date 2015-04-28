angular.module('rokort').service('Settings', () => new Settings());

class Settings {

    private defaults = {
        distance: 10,
        maxDistance: 20
    };

    get(property) {
        return JSON.parse(localStorage.getItem(property)) || this.defaults[property];
    }

    set(property, value) {
        localStorage.setItem(property, JSON.stringify(value));
    }
}