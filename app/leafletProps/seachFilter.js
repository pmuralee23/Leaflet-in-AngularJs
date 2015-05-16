(function () {
    "use strict";
    angular.module('employeeManagement').filter('searchFilter', [function() {
          return function(totalRecords, searchProperty, searchValue) {
            var matches = {type:'FeatureCollection', features:[]};
            angular.forEach(totalRecords.features, function(featureObject, featureKey) {
            for(var i=0; i<searchProperty.length; i++){
                
                var search = searchValue.toLowerCase(),
                    property = '',
                    temp = false;
                if (featureObject.hasOwnProperty(searchProperty[i])) {
                    property = typeof featureObject[searchProperty[i]] == "string"?
                        featureObject[searchProperty[i]].toLowerCase():
                        featureObject[searchProperty[i]]
                  
                  temp = property.indexOf(search) > -1? true : false;

                  if(typeof featureObject[searchProperty[i]] === 'object'){
                    for( var j=0; j<property.length; j++)
                        property[j] = property[j].toLowerCase();
                        temp = property.indexOf(search) > -1? true : false;
                  }
 
                    if(temp) {
                      matches.features.push(featureObject);
                      break;
                    }
                  }
            }
              
            });
            return matches;
          };
    }]);
}());