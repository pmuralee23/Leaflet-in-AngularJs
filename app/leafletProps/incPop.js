// Not in use
(function(){
	"use strict";
	angular
        .module("employeeManagement")
        .directive('incPop', function() {
			  return {
			    restrict: 'EA',
			    link: function(scope, $elm, attrs) {
			      
			    },
			    template:'<div>Hello? How r u??</div>'
			  }
		});

}());