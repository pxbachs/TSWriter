scriptWriterApp.controller('StepsController', function($scope, $http) {
	$http.get('data/ios/steps_defination.json').success(function(data) {
		$scope.steps_def = data;
		angular.forEach($scope.steps_def, function(value, key){
              console.log(value.id + ": " + key);
         });
	});
}); 

scriptWriterApp.directive('stepsRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
    	createSortableCloneList(document.getElementById(attrs.groupId));
    }
  };
});