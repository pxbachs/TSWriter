scriptWriterApp.controller('StepsController', ["$scope", "$http", "$routeParams",
function($scope, $http,$routeParams) {
	$http.get('data/'+$routeParams.platform+'/steps_defination.json').success(function(data) {
		//$scope.group_steps = [];
		//$scope.group_steps.push({pre_def: data});
		//console.log($scope.group_steps);
		$scope.steps_def = data;
		angular.forEach($scope.steps_def, function(value, key) {
			console.log(value.id + ": " + key);
		});

		$scope.models = [];
		$scope.models.feature = [{
			"A" : {}
		}];
	});
	

}]);

scriptWriterApp.controller('DashboardController', ["$scope",
function($scope) {
}]);

scriptWriterApp.controller('FeatureController', ["$scope", "$http", "$uibModal",
function($scope, $http, $uibModal) {
	
	$scope.$on('$locationChangeStart', function(event) {
        var answer = confirm("Are you sure you want to leave this page?")
        if (!answer) {
            event.preventDefault();
        }
    });
    
	$scope.index_id = 0;

	$http.get('data/ios/steps_defination.json').success(function(data) {
		//$scope.group_steps = [];
		//$scope.group_steps.push({pre_def: data});
		//console.log($scope.group_steps);
		$scope.steps_def = [{
			"id" : "see",
			"name" : "See",
			allowedTypes : ['step'],
			"type" : "scenario",
			"steps" : []
		}];

		angular.forEach($scope.steps_def, function(value, key) {
			//console.log(value.id + ": " + key);
		});

	});

	$scope.scenarioAllowedTypes = ["scenario"];
	$scope.stepAllowedTypes = ["step"];

	$scope.models = {
		selected : null,
		templates : [{
			index : 1,
			type : "step",
			name : "Given step",
			id : "step-custom-given-1",
			syntax : "Given You want an action here",
			rb : "Given /^You want an action here$/ do |_| \n\nend\n"
		}, {
			index : 1,
			type : "step",
			name : "Then Step",
			id : "step-custom-then-1",
			syntax : "Then You want an action here",
			rb : "Then /^You want an action here$/ do |_| \n\nend\n"
		}, {
			index : 1,
			type : "step",
			name : "And Step",
			id : "step-custom-and-1",
			syntax : "And You want an action here",
			rb : "And /^You want an action here$/ do |_| \n\nend\n"
		}, {
			index : 1,
			id : "scenario-custom-1",
			name : "Scenario ",
			allowedTypes : ['step'],
			type : "scenario",
			steps : []
		}]
	};

	$scope.addScenario = function() {
		//console.log($scope.steps_def);
		$scope.index_id = $scope.index_id + 1;
		$scope.steps_def = $scope.steps_def.concat({
			"id" : "scenari0_" + $scope.index_id,
			"name" : "Scenario " + $scope.index_id,
			allowedTypes : ['step'],
			"type" : "scenario",
			"steps" : []
		});
		//$scope.models.dropzones["A"] = $scope.models.dropzones["A"].concat({type: "container", id: 10, columns: [[], []]});
	};

	$scope.selectedEditStep = null;

	$scope.showEdit = function(evt) {
		console.log(evt.step);
		$scope.selectedEditStep = evt.step;
		var modalInstance = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'myModalContent.html',
			controller : 'EditStepModalInstanceCtrl',
			size : 'lg',
			resolve : {
				step : $scope.selectedEditStep
			}
		});

		modalInstance.result.then(function(selectedItem) {
			console.log(selectedItem);
			$scope.selectedEditStep.syntax = selectedItem.syntax;
			$scope.selectedEditStep.rb = selectedItem.rb;
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});

	};

$scope.selectedScenario = null;
$scope.selectedStepIdx = 0;

	$scope.remove = function(scenario, idx) {
		$scope.selectedScenario = scenario;
		$scope.selectedStepIdx = idx;
		$scope.selectedEditStep = scenario[idx];
		
		var modalInstanceRemove = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'removeStepModalContent.html',
			controller : 'RemoveStepModalInstanceCtrl',
			size : 'sm',
			resolve : {
				step: $scope.selectedEditStep,
				idx : $scope.selectedStepIdx
			}
		});

		modalInstanceRemove.result.then(function(idx) {
			$scope.selectedScenario.splice(idx, 1);
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});
	};

	$scope.save = function() {
		console.log("Call save" + $scope.features);
		var zip = new JSZip();
		console.log(zip);
		zip.file("testscript.feature", $scope.features);
		zip.file("testscript.rb", $scope.rubyCode);
		zip.file("testscript.json", $scope.modelAsJson);
		
		var content = zip.generate({
			type : "blob"
		});
		// see FileSaver.js
		saveAs(content, "testscript.zip");
	};

	$scope.showImport = function() {
		var modalInstanceRemove = $uibModal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'ImportModalContent.html',
			controller : 'ImportModalInstanceCtrl',
			size : 'lg',
			resolve : {}
		});

		modalInstanceRemove.result.then(function(importContent) {
			console.log(importContent);
			$scope.steps_def = angular.fromJson(importContent);
		}, function() {
			console.log('Modal dismissed at: ' + new Date());
		});
	};
	
	$scope.$watch('steps_def', function(model) {
		$scope.modelAsJson = angular.toJson(model, true);
		features = "";
		rbCode = "";

		angular.forEach($scope.steps_def, function(value, key) {
			//console.log(value.id + ": " + value.steps);
			features += "Scenario: " + value.name;
			angular.forEach(value.steps, function(value, key) {
				console.log(value.id + ": " + value.id.indexOf("custom"));
				features += "\n" + value.syntax;

				if (value.id.indexOf("step-custom") === 0 && value.rb) {
					rbCode += value.rb + "\n";
				}
			});
			features += "\n\n\n";
		});

		$scope.features = features;
		$scope.rubyCode = rbCode;

	}, true);
}]);

scriptWriterApp.controller('EditStepModalInstanceCtrl', function($scope, $uibModalInstance, step) {

	//$scope.selectedEditStep = {index: 1, type: "step",name:"Step", id: "custom-",  syntax:"Then You want an action here",rb:"Then /^You want an action here$/ do |_| \n\n end"};
	//$scope.selectedEditStep.id = step.id;
	//$scope.selectedEditStep.syntax = step.syntax;
	$scope.selectedEditStep = angular.copy(step);
	if ($scope.selectedEditStep.id.indexOf("step-custom") === 0) {
		if (!$scope.selectedEditStep.rb)
			$scope.selectedEditStep.rb = "Then /^You want an action here$/ do |_| \n\nend\n";
		$scope.rbCodeReadOnly = false;
	} else {
		$scope.rbCodeReadOnly = true;
	}

	$scope.ok = function() {
		//$scope.selectedEditStep.syntax = "new syntax " + new Date();
		$uibModalInstance.close($scope.selectedEditStep);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});

scriptWriterApp.controller('RemoveStepModalInstanceCtrl', function($scope, $uibModalInstance, step, idx) {
	console.log("RemoveStepModalInstanceCtrl " + idx);
	$scope.selectedStep = step;
	$scope.selectedIdx = idx;
	
	$scope.ok = function() {
		$uibModalInstance.close($scope.selectedIdx);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});

scriptWriterApp.controller('ImportModalInstanceCtrl', function($scope, $uibModalInstance) {
	console.log("ImportModalInstanceCtrl ");
	
	$scope.ok = function() {
		$uibModalInstance.close($scope.importContent);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
	
	$scope.myLoaded = function() {
		console.log($scope.file.data);
		$scope.importContent = $scope.file.data;
	};
});

scriptWriterApp.directive('stepsRepeatDirective', function() {
	return function(scope, element, attrs) {
		if (scope.$last) {
			createSortableCloneList(document.getElementById(attrs.groupId));
		}
	};
}); 