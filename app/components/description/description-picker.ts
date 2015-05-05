angular.module("rokort")
    .directive("descriptionPicker", function() {
        return {
            restrict: "E",
            scope: {selected: "="},
            bindToController: true,
            templateUrl: "description/description-picker.html",
            controllerAs: "ctrl",
            controller: DescriptionPickerController
        };
    });

class DescriptionPickerController {
    descriptions: Array<Object>;
    selected: Object;

    constructor(private Description) {
        this.descriptions = Description.getAll();
        this.selected = this.descriptions[0];
    }
}
