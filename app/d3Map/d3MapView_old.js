(function () {
    "use strict";
    
    angular
        .module("employeeManagement")
        .controller("MapCtrl",
                    ["$scope", "$http",
                     MapCtrl]);
    function MapCtrl($scope, $http){
      var width = 300, height = 300, translate = [width / 2, height / 2];

      var projections = [ 
                         {name: 'azimuthalEqualArea', fn:
                         d3.geo.azimuthalEqualArea()
                         .scale(50)
                         .translate(translate)},
                         {name: 'conicEquidistant', fn: d3.geo.conicEquidistant()
                         .scale(35)
                         .translate(translate)},
                         {name: 'equirectangular', fn: d3.geo.equirectangular()
                         .scale(50)
                         .translate(translate)},
                         {name: 'mercator', fn: d3.geo.mercator()
                         .scale(50)
                         .translate(translate)},
                         {name: 'orthographic', fn: d3.geo.orthographic()
                         .scale(90)
                         .translate(translate)},
                         {name: 'stereographic', fn: d3.geo.stereographic()
                         .scale(35)
                         .translate(translate)}
                         ];
      d3.json("app/d3Map/world.json", function (error, world) {//<-B
             projections.forEach(function (projection) {
                     var path = d3.geo.path() // <-C
                     .projection(projection.fn);
                     var div = d3.select("#world-map")
                     .append("div")
                     .attr("class", "map");
                     var svg = div
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);
                     svg.append("path") // <-D
                     .datum(topojson.feature(world,
                     world.objects.land))
                     .attr("class", "land")
                     .attr("d", path);
              

              svg.append("path") // <-E
                 .datum(topojson.mesh(world,
                 world.objects.countries))
                 .attr("class", "boundary")
                 .attr("d", path);
                 div.append("h3").text(projection.name);
                 });
                 });
      }


      }());