(function () {
    "use strict";
    angular.module('employeeManagement').factory('userService', function($http) {
	    return {
	        getAllUsers: function() {
	            var url = "app/leafletProps/leafLetData.json";
	            return $http.get(url);
	        }
	    };
	});
}());