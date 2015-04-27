angular.module('rokort')
    .directive('rowerPicker', function() {
        return {
            restrict: 'E',
            scope: {},
            controllerAs: 'ctrl',
            templateUrl: 'rowers/rower-picker.html',
            controller: RowerPickerController
        };
    });

class RowerPickerController {
    rowers: Array<Number>;

    constructor(Rowers, private Settings) {
        this.rowers = [{name: "Rasmus Reimer"}, {name: "Jurij"}, {name: "Morten Moth"}];
    }

    setRower(rowerid) {
        this.Settings.set('rowerid', rowerid);
    }
}