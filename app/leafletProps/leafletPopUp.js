(function () {
    "use strict";    
    angular
        .module("employeeManagement")
        .directive('incPop', function() {
              return {
                templateUrl:'app/leafletProps/leafletPopUp.html',
                restrict: 'EA',
                replace:true,
                      scope:true,
                link: function(scope, $elm, attrs) {
                  
                }
                
              }
        });
});