var scriptWriterApp = angular.module('scriptWriterApp', ["scriptWriterServices", "ngRoute", 'ui.bootstrap', "dndLists", "uuid", 'ui.ace']);

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
            .when('/info', {
                templateUrl: 'partials/info.html',
                controller: 'InfoController'
            })
            .when('/help', {
                templateUrl: 'partials/help.html',
                controller: 'HelpController'
            })
            .when('/multi', {
                templateUrl: 'multi/multi-frame.html',
                controller: 'MultiDemoController'
            })
            .otherwise({redirectTo: '/dashboard'});
    })

    .directive('navigation', function($rootScope, $location) {
        return {
            template: '<li ng-repeat="option in options" ng-class="{active: isActive(option)}">' +
                      '    <a ng-href="{{option.href}}">{{option.label}}</a>' +
                      '</li>',
            link: function (scope, element, attr) {
                scope.options = [
                    {label: "Create iOS Script", href: "#/feature/ios"},
                    {label: "Create Android Script", href: "#/feature/android"},
                ];

                scope.isActive = function(option) {
                    return option.href.indexOf(scope.location) === 1;
                };

                $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
                    scope.location = $location.path();
                });
            }
        };
    })
    .directive('fileSelect', ['$window', function ($window) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attr, ctrl) {
            var fileReader = new $window.FileReader();

            fileReader.onload = function () {
                ctrl.$setViewValue(fileReader.result);

                if ('fileLoaded' in attr) {
                    scope.$eval(attr['fileLoaded']);
                }
            };

            fileReader.onprogress = function (event) {
                if ('fileProgress' in attr) {
                    scope.$eval(attr['fileProgress'], {'$total': event.total, '$loaded': event.loaded});
                }
            };

            fileReader.onerror = function () {
                if ('fileError' in attr) {
                    scope.$eval(attr['fileError'], {'$error': fileReader.error});
                }
            };

            var fileType = attr['fileSelect'];

            el.bind('change', function (e) {
                var fileName = e.target.files[0];
                if (fileType === '' || fileType === 'text' || fileName.type === 'application/json') {
                    fileReader.readAsText(fileName);
                } else if (fileType === 'data') {
                    fileReader.readAsDataURL(fileName);
                }
            });
        }
    };
}]);
