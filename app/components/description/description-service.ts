angular.module('rokort')
    .service('Description', (Settings) => new Description(Settings));

class Description {
    constructor(private Settings) { }

    getAll() {
        return [].concat(this.Settings.get('descriptions'));
    }

    add(description) {
        this.Settings.set('descriptions',
            this.getAll().push(description)
        );
    }

    remove(description) {
        this.Settings.set('descriptions',
            this.getAll().filter(d => d !== description)
        );
    }
}