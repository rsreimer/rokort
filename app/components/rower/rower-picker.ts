angular.module('rokort')
    .directive('rowerPicker', function() {
        return {
            restrict: 'E',
            scope: {selected: '='},
            templateUrl: 'rower/rower-picker.html',
            controllerAs: 'ctrl',
            controller: RowerPickerController
        };
    });

class RowerPickerController {
    rowers: Array<Object>;
    selected: Object;
    isEditing: Boolean = false;

    constructor(private Rower, private $scope) {
        var rower = Rower.get();

        this.$scope.selected = rower;
        this.selected = rower;
        this.isEditing = rower === undefined;

        Rower.getAll()
            .then(rowers => this.rowers = rowers);
    }

    select(rower) {
        if (!rower) return;

        this.Rower.set(rower);
        this.$scope.selected = rower;

        this.isEditing = false;
    }
}