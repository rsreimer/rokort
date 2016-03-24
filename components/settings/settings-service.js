angular.module("rokort")
    .service('Settings', function() {
        return {
            rower: 358,
            distance: 10,
            boats: [{id:'1033', name:'Det røde lyn'}],
            descriptions: ['Havnen', 'Handicap', 'Den permanente', '10 km mærket']
        }
    });