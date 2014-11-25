app.factory('workitemService',
  function ($resource) {
  	var workitemService = {};

  	var workitemResource = $resource('/workitem.json', {}, {
      deactivateTask : {
        method : 'PUT',
        url: '/deactivateTask.json'
      },
      updateTask : {
        method : 'PUT',
        url: '/workitem.json'
      }
    });
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
  	};

  	workitemService.getWorkEstimate = function() {
  		return timeBarResource.get().$promise.then(function(workEstimateInfo) {
  			return workEstimateInfo.totaltime / 60.0;
  		});
  	};

    workitemService.completeTask = function(id) {
      return workitemResource.deactivateTask({id : id}).$promise.then(function(response) {
        return response.total_work_time;
      });
    };

    workitemService.updateTask = function(task) {
      var dueDate = task.date;
      var estimatedTime = parseFloat(task.time) * 60;
      var remainingTime = parseFloat(task.completedTime) * 60;  
      var title = task.name;
      var workitemObj = { id: task.id, due_date: dueDate, minutes_needed: estimatedTime, minutes_completed: remainingTime, content: title, active: true};
      return workitemResource.updateTask(workitemObj).$promise.then(function(workitem) {
        var task = {
          name: workitem.content,
          time: workitem.minutes_needed/ 60,
          completedTime: workitem.minutes_completed / 60,
          date: new Date(workitem.due_date),
          id: workitem.id
        }; 
        return task;
      });
    };
  	return workitemService;
  });