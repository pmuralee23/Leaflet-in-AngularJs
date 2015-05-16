(function(){
	"use strict";

	angular
        .module("employeeManagement")
        .directive("empListView", function(){
        	return {
				      templateUrl: 'app/leafletProps/empListView.html',
				      restrict: 'E',

				      replace:true,
				      scope:true,
				      controller: function($scope){
				      	$scope.openPanel = function(){
				      		alert('hello');
				      	};
				      },
				      link: function postLink(scope, element, attrs) {
				        
				        scope.$watch(attrs.show, function(value){
				          if(value == true)
				            $(element).modal('show');
				          else
				            $(element).modal('hide');
				        });

				        $(element).on('shown.bs.modal', function(){
				          scope.$apply(function(){
				            scope.$parent[attrs.show] = true;
				          });
				        });

				        $(element).on('hidden.bs.modal', function(){
				          scope.$apply(function(){
				            scope.$parent[attrs.show] = false;
				          });
				        });
				      }
    		};
        });
	
	angular
        .module("employeeManagement")
        .directive('scrollOnClick', function() {
			  return {
			    restrict: 'A',
			    link: function(scope, $elm, attrs) {
			      $elm.on('click', function() {
			      	if( scope.status.open){
			      		setTimeout(function(){
			      			var target = $elm.closest('.accordion-group').get(0).offsetTop;
				      		// console.log($elm.closest('.accordion-group').get(0)+" --- "+target);
				      		$(".modal-body").animate({scrollTop: target}, 300);
			      		},400);
			      	   
			      	}
			        
			      });
			    }
			  }
		});

		

}());