var scriptWriterApp = angular.module('scriptWriterApp', ["ngRoute", 'ui.bootstrap', "dndLists"]);
scriptWriterApp.config(function($routeProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: 'partials/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/feature/:platform', {
                templateUrl: 'partials/feature.html',
                controller: 'FeatureController'
            })
            .when('/types', {
                templateUrl: 'types/types-frame.html',
                controller: 'TypesDemoController'
            })
            .when('/advanced', {
                templateUrl: 'advanced/advanced-frame.html',
                controller: 'AdvancedDemoController'
            })
            .when('/multi', {
                templateUrl: 'multi/multi-frame.html',
                controller: 'MultiDemoController'
            })
            .otherwise({redirectTo: '/feature/ios'});
    })

    .directive('navigation', function($rootScope, $location) {
        return {
            template: '<li ng-repeat="option in options" ng-class="{active: isActive(option)}">' +
                      '    <a ng-href="{{option.href}}">{{option.label}}</a>' +
                      '</li>',
            link: function (scope, element, attr) {
                scope.options = [
                    {label: "Create iOS Script", href: "#/feature/ios"},
                    {label: "Create Android Script", href: "#/feature/ios"},
                ];

                scope.isActive = function(option) {
                    return option.href.indexOf(scope.location) === 1;
                };

                $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
                    scope.location = $location.path();
                });
            }
        };
    });
function createSortableCloneList(elm) {

}
