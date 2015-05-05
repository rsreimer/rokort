angular.module("rokort")
    .directive("boatPicker", function() {
        return {
            restrict: "E",
            scope: {selected: "="},
            bindToController: true,
            templateUrl: "boat/boat-picker.html",
            controllerAs: "ctrl",
            controller: BoatPickerController
        };
    });

class BoatPickerController {
    boats: Array<Object>;
    selected: Object;

    constructor(private Boat) {
        this.boats = Boat.getAll();
        this.selected = this.boats[0];
    }
}
