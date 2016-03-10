'use strict';

/* Services */

var scriptWriterServices = angular.module('scriptWriterServices', ['ngResource']);

scriptWriterServices.service('StepsPredefinedSrv', ['$http',function($http){
    var self = this;
    self.notificationSubscribers={};
    self.customGroup = null;
    
    self.awaitUpdate=function(key,callback){
        self.notificationSubscribers[key]=callback;
    };
    self.notifySubscribers=function(){
        angular.forEach(self.notificationSubscribers,
            function(callback,key){
                callback();
            });
    };
    
    self.get = function(platform){
    	console.log(platform);
    	
    	$http.get('data/'+ platform + '/steps_defination.json').success(function(data) {
			self.steps_def = data;
			self.steps_def.platform = platform;
			
			self.notifySubscribers();
		});
		
		$http.get('data/'+ platform + '/apis.html').success(function(data){
			console.log(data);
			self.predefinedAPIs = data;
		});
    };
    
    self.addCustomStep = function(step){
    	if (step.type === "step"){
	    	angular.forEach(self.steps_def,
	            function(value,key){
	                if (value.id === "custom"){
	                	self.customGroup = value;
	                }
	            });
	            
	        if (self.customGroup === null){
	        	self.customGroup = {
							"id": "custom",
							"name": "Custom",
							"steps": []};
	        	self.steps_def.push(self.customGroup);
	        } 
	        var stepExisted = false;
	        angular.forEach(self.customGroup.steps, function(value, key){
	        	if (value.id === step.id) {
	        		stepExisted = true;
	        	}
	        });
	        if (!stepExisted){
	        	console.log("Step is not existed");
	        	self.customGroup.steps.push(step);
	        	self.notifySubscribers();
	        }
	        
        }
    };
}]);