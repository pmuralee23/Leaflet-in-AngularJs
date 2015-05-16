
(function () {
    "use strict";
    var app = angular.module("employeeManagement",
        ["common.services",
            "ui.router",
            "ui.mask",
            "ui.bootstrap",
            "angularCharts"]);

    app.config(function ($provide) {
        $provide.decorator("$exceptionHandler",
            ["$delegate",
                function ($delegate) {
                    return function (exception, cause) {
                        exception.message = "Please contact the Help Desk! \n Message: " +
                                                                exception.message;
                        $delegate(exception, cause);
                        alert(exception.message);
                    };
                }]);
    });

    app.config(["$stateProvider",
            "$urlRouterProvider",
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise("/");

                $stateProvider
                    .state("home", {
                        url: "/",
                        templateUrl: "app/welcomeView.html"
                    })
                    .state("leafletView",{
                        url: "/leafletView",
                        templateUrl:"app/leafletProps/leafletView.html",
                        controller: "LeafletViewCtrl"
                    })
                    .state("d3MapView",{
                        url:"/d3View",
                        templateUrl: "app/d3Map/d3MapView.html",
                        controller:'MapCtrl'
                    })
                    
            }]
    );

}());