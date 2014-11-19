app.factory('workitemService',
  function ($resource) {
  	var workitemService = {};

  	var workitemResource = $resource('/workitem.json');
  	var timeBarResource = $resource('/workestimate.json');
  	workitemService.createWorkitem = function(task) {
		var dueDate = task.date;
		var estimatedTime = parseFloat(task.time) * 60;
		var remainingTime = parseFloat(task.completedTime) * 60;
		var title = task.name;
		var workitemObj = { due_date: dueDate, minutes_needed: estimatedTime, minutes_completed: remainingTime, content: title, active: true};
  		return workitemResource.save({workitem : workitemObj}).$promise.then(function(response) {
  			return response;
  		});
  	};

  	workitemService.getWorkItems = function() {
  		return workitemResource.query().$promise.then(function(workItems) {
  			return workItems;
  		});
  	}

  	workitemService.getWorkEstimate = function() {
  		return timeBarResource.get().$promise.then(function(workEstimateInfo) {
  			return workEstimateInfo.totaltime / 60.0;
  		});
  	};
  	return workitemService;
  });