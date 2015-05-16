
(function () {
    "use strict";
    
    angular
        .module("employeeManagement")
        .controller("LeafletViewCtrl",
                    ["$scope", "$http", "$filter", "$compile", "$templateCache", "$timeout", "userService",
                     LeafletViewCtrl]);

    function LeafletViewCtrl($scope, $http, $filter, $compile, $templateCache, $timeout, userService){
        $scope.title="Employees Location View";
        $scope.searchEmp = '';
        $scope.modalShown = false;
        $scope.oneAtATime = true;
        $scope.totalRecords = {};
        $scope.popUpTemplate = "";
        $scope.center = new L.LatLng(20.632784, 80.024414); //start over India
        $scope.base = new L.TileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '&copy;ESRI and its licensors',
                    subdomains: '1234'
                });
        L.Icon.Default.imagePath = './js/leaflet/dist/images';
        $scope.markersLayer = "";
        $scope.map = new L.Map('map', {
                center: $scope.center,
                zoom: 4,
                layers: [$scope.base]
            });
        
        $scope.map.attributionControl.setPrefix('<a href="http://leafletjs.com/" target="_blank">Leaflet</a>');

        $http.get('app/leafletProps/leafletPopUp.html').success(function(res){
                $scope.popUpTemplate = res;
            }).error(function(){
                console.log('Encountered some error. Please check back after few minutes.');
            });

        
        // Launches new Leaflet map with proper map layers, attribution, etc.  Does not handle the loading of points/clusters yet
            
        var that =this;
        userService.getAllUsers().success(function(res){
            $scope.totalRecords = res;
            $scope.buildMap(res);
        }).error(function(){
            console.log('Errororrrrrrr');
        });
        $scope.loadPropertyPopup = function(feature, layer){
            var options = {
                minWidth: 350,
                autoPanPadding: L.point(60, 60)
            };
            
            // need to find a better way to buid the pop-up template
            // find a way to bind the remote template
            var str = "";
                str += "<table class='table table-striped table-bordered popup-table'>";
                str += "<thead><th colspan='2'>Employee Details</th></thead>"
                str += "<tbody>";
                str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Employee Id</td>";
                str += "<td class='info-value'>"+feature.employeeId+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Name</td>";
                str += "<td class='info-value'>"+feature.employeeName+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Experience</td>";
                str += "<td class='info-value'>"+feature.yearsOfExp+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Major Skill</td>";
                str += "<td class='info-value'>"+feature.majorSkill+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Reporting Manager</td>";
                str += "<td class='info-value'>"+feature.immediateManager+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Mobile Number</td>";
                str += "<td class='info-value'>"+feature.mobileNumber+"</td></tr>";
                 str += "<tr class='property-info-row'>";
                str += "<td class='info-key'>Location</td>";
                str += "<td class='info-value'>"+feature.branch+", "+feature.location+"</td></tr>";
                str += "</tbody> </table>";

             
            var templ = $compile(str)($scope);
            layer.bindPopup(templ[0], options);
    }
    
    $scope.searchData = function(){
        var searchStr = $scope.searchEmp;
        var searchResuts = $filter('searchFilter')($scope.totalRecords, ['employeeName','majorSkill', 'skills'], searchStr);
        if(searchResuts.features.length>0){
            this.markersLayer.clearLayers();
            $scope.buildMap(searchResuts);
            $scope.zoomToCurrentEmployees();
        } else{
            alert('No records found');
        }
        
    };
    $scope.clearSearchBox = function(){
        $scope.searchEmp = '';
    };
    $scope.resetEmp = function(){
        $scope.searchEmp = '';
        $scope.searchData();
        $scope.zoomToCurrentEmployees();
    }
    $scope.zoomToCurrentEmployees = function(){
        var newBounds = this.markersLayer.getBounds();
        this.map.fitBounds(newBounds);
    };
    $scope.zoomToCurrentPropertiesWhenREALLYReady = function(){
        $timeout($.proxy(function () {
                this.zoomToCurrentEmployees();
            }, this), 200);
    }
    $scope.buildMap = function(res){
        
        var employeeData = angular.fromJson(res);
        // Just what it sounds like-- grabs the data as a GeoJSON Feature Collection and loads it in to the Leaflet map
        console.log('SP: Adding properties');
        var that = this;
        // var markers = L.markerClusterGroup({
        //     disableClusteringAtZoom: 14
        // });
        var points = L.geoJson(employeeData, {
            onEachFeature: $.proxy(this.loadPropertyPopup, this),
        });

        this.markersLayer = new L.MarkerClusterGroup({
            showCoverageOnHover: false, 
            maxClusterRadius: 50,
            animateAddingMarkers: true,
            iconCreateFunction: function(cluster) {
                var clusterSize = "small";
                if (cluster.getChildCount() > 10 && cluster.getChildCount() <= 100) {
                    clusterSize = "medium";
                }else if (cluster.getChildCount() > 100) {
                    clusterSize = "large";
                }
                return new L.DivIcon({
                    html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                    className: 'marker-cluster marker-cluster-' + clusterSize,
                    iconSize: new L.Point(40, 40)
                });
            }
        });

        // loadMarkersLayer(points);
        // load all points in the points-array (passed as an argument) to the markers layer
        points.eachLayer(function (property) {
            that.markersLayer.addLayer(property);
            property.on('click', function(){console.log('point clicked');});
        });

        this.map.addLayer(that.markersLayer);
        
        // this.map.addLayer(markers);
        this.map._layersMaxZoom=14; 
        console.log('SP: Property layer added');

        this.map.whenReady(function () {
                this.zoomToCurrentPropertiesWhenREALLYReady();
            }, this);
    }

    $scope.getVisibleProps = function(){
        var currentBounds = this.map.getBounds(),
            visibleProperties = [];

        this.markersLayer.eachLayer(function (propertyPoint) {
            var propertyLocation = propertyPoint.getLatLng();
            if ( currentBounds.contains(propertyLocation) ) {
                visibleProperties.push(propertyPoint);
            }
        }, this);
        // this data will be passed to the modal window of listview
        $scope.empData = visibleProperties;
    };

    $scope.showModal = function(){
        $scope.getVisibleProps();
         $scope.modalShown = !$scope.modalShown;
     };
}
}());
