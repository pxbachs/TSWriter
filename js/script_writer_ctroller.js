scriptWriterApp.controller('StepsController', ["$scope", "$http", function($scope, $http) {
	$http.get('data/ios/steps_defination.json').success(function(data) {
		//$scope.group_steps = [];
		//$scope.group_steps.push({pre_def: data});
		//console.log($scope.group_steps);
		$scope.steps_def = data;
		angular.forEach($scope.steps_def, function(value, key){
              console.log(value.id + ": " + key);
         });
         
         $scope.models = [];
         $scope.models.feature = [{"A":{}}];
	});
}]); 

scriptWriterApp.controller('DashboardController',["$scope", function($scope){}]);

scriptWriterApp.controller('FeatureController', ["$scope", "$http", function($scope, $http) {
	
  $scope.items = ['item1', 'item2', 'item3'];

  	$scope.index_id = 0;
	
	$http.get('data/ios/steps_defination.json').success(function(data) {
		//$scope.group_steps = [];
		//$scope.group_steps.push({pre_def: data});
		//console.log($scope.group_steps);
		$scope.steps_def = [{"id": "see", "name": "See", allowedTypes: ['step'], "type":"scenario", "steps": []}];
		
		angular.forEach($scope.steps_def, function(value, key){
              //console.log(value.id + ": " + key);
         });

	});
	
	$scope.scenarioAllowedTypes= ["scenario"];
	$scope.stepAllowedTypes= ["step"];
	
	$scope.models = {
        selected: null,
        templates: [
            {index: 1, type: "step",name:"Step", id: "custom-",  syntax:"Then You want an action here"},
            {index: 1, id: "scenario_",  name: "Scenario ", allowedTypes: ['step'], type:"scenario", steps: []}
        ]
      };
      
	$scope.addScenario = function() {
		//console.log($scope.steps_def);
		$scope.index_id = $scope.index_id + 1;
		$scope.steps_def = $scope.steps_def.concat({"id": "scenari0_" + $scope.index_id,  "name": "Scenario " + $scope.index_id, allowedTypes: ['step'], "type":"scenario", "steps": []});
		//$scope.models.dropzones["A"] = $scope.models.dropzones["A"].concat({type: "container", id: 10, columns: [[], []]});
	};
	
	$scope.showEdit = function(evt){
		console.log(evt.step);
		$('#exampleModal').modal({});
		
	};
	
	$scope.$watch('steps_def', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        features = "";
        angular.forEach($scope.steps_def, function(value, key){
              //console.log(value.id + ": " + value.steps);
              features += "Scenario: " + value.name;
              angular.forEach(value.steps, function(value, key){
	              //console.log(value.id + ": " + value.syntax);
	              features += "\n" + value.syntax;
         		});
         	features += "\n\n\n";
         });
        
        $scope.features = features;
    }, true);
}]);

scriptWriterApp.directive('stepsRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
    	createSortableCloneList(document.getElementById(attrs.groupId));
    }
  };
});