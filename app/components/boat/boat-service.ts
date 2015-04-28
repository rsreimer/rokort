angular.module('rokort')
    .service('Boat', (Settings) => new Description(Settings));

class Description {
    constructor(private Settings) { }

    getAll() {
        return [].concat(this.Settings.get('boats'));
    }

    add(description) {
        this.Settings.set('boats',
            this.getAll().push(description)
        );
    }

    remove(description) {
        this.Settings.set('boats',
            this.getAll().filter(d => d !== description)
        );
    }
}