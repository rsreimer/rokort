angular.module('rokort')
    .directive('rowerPicker', function() {
        return {
            restrict: 'E',
            bindToController: true,
            templateUrl: 'rower/rower-picker.html',
            controllerAs: 'ctrl',
            controller: RowerPickerController
        };
    });

class RowerPickerController {
    rowers: Array<Object>;
    selected: Object;
    isEditing: Boolean = false;

    constructor(private Rower) {
        this.selected = Rower.get();
        this.isEditing = this.selected === undefined;

        Rower.getAll()
            .then(rowers => this.rowers = rowers);
    }

    select(rower) {
        if (!rower) return;

        this.Rower.set(rower);

        this.isEditing = false;
    }
}