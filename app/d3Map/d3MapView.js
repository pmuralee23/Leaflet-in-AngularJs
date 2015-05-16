(function () {
    "use strict";
    
    angular
        .module("employeeManagement")
        .controller("MapCtrl",
                    ["$scope", "$http",
                     MapCtrl]);
    function MapCtrl($scope, $http){
      var width = 960,
          height = 500;
      var projection = d3.geo.albersUsa().translate([width/2, height/2]).scale(1000);

      var path = d3.geo.path().projection(projection);
      var color = ["rgb(237,248,233)", "rgb(186,228,179)", "rgb(116,196,118)", "rgb(49,163,84)","rgb(0,109,44)"];

      d3.json("app/d3Map/us1.json", function( json) {

        

        var div = d3.select("#world-map")
                     .append("div")
                     .attr("class", "map");

        var svg = div
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);

        var data = json.features;
        svg.selectAll("path")
           .data(data)
           .enter()
           .append("path")
           .attr("d", path)
           .on('mouseover', function(d){
            
           });

          d3.csv("app/d3Map/us-population.csv", function(data) {
          //Do something…
          svg.selectAll("circle")
              .data(data)
              .enter()
              .append("circle")
              .attr("cx", function(d) {
              return projection([d.longitude, d.latitude])[0];
              })
              .attr("cy", function(d) {
              return projection([d.longitude, d.latitude])[1];
              })
              .attr("r", 5)
              .style("fill", "yellow")
              .style("opacity", 0.75);
          });
      });

      //      svg.selectAll("circle")
      //         .data(data)
      //         .enter()
      //         .append("circle")
      //         .attr("cx", function(d) {
               
      //         //return projection([d.geometry.coordinates[0][0][0], d.geometry.coordinates[0][0][0] ])[0];
      //         })
      //         .attr("cy", function(d) {
      //         //return projection([d.geometry.coordinates[0][0][1], d.geometry.coordinates[0][0][1]])[1];
      //         })
      //         .attr("r", 5)
      //         .style("fill", "#73B502")
      //         .style("opacity", 0.75);
      // });

    }
      }());