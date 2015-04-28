angular.module('rokort')
    .directive('rowerPicker', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'rowers/rower-picker.html',
            controllerAs: 'ctrl',
            controller: RowerPickerController
        };
    });

class RowerPickerController {
    rowers: Array<Object>;
    selected: Object;

    constructor(Rowers, private Settings, private $scope) {
        Rowers
            .getAll()
            .then(rowers => this.rowers = rowers);

        $scope.$watch(this.selected, () => {
            if (!this.selected) return;

            this.Settings.set('rowerid', this.selected.id);
        });
    }
}