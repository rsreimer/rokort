angular.module('rokort').service('Settings', Settings);

function Settings() {
    return {
        rower: 358,
        distance: 10,
        boats: [{id:'1033', name:'Det røde lyn'}, {id: '30', name:'Polokajak'}],
        descriptions: ['Havnen', 'Handicap', 'Kajakpolo', 'Den permanente', '10 km mærket']
    }
}