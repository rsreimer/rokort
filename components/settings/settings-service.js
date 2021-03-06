angular.module("rokort")
    .service('Settings', function() {
    	var profile = window.location.search.substring(1);

    	if (profile)
    		localStorage.setItem('profile', profile);
    	else
    		profile = localStorage.getItem('profile');

    	switch(profile) {
    		case "rasmus":
	    		return {
		            rower: 358,
		            distance: 10,
		            boats: [{id:'1033', name:'Det røde lyn'}],
		            descriptions: ['Havnen', 'Handicap', 'Den permanente', '10 km mærket']
		        }

		    case "anders":
		    	return {
		            rower: 562,
		            distance: 10,
		            boats: [{id:'1063', name:"Anders' kajak"}],
		            descriptions: ['Havnen', 'Handicap', 'Den permanente', '10 km mærket']
		        }

		    case "ida":
		    	return {
		            rower: 62,
		            distance: 10,
		            boats: [{id:'1064', name:"Ida's kajak"}],
		            descriptions: ['Havnen', 'Handicap', 'Den permanente', '10 km mærket']
		        }
    	}
    });