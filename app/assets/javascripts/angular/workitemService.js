app.factory('workitemService', [ "$resource",
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
      },
      eventsToday : {
        method: 'GET',
        url: '/eventsToday.json',
        isArray: true
      },
      weeklySummary : {
        method: 'GET',
        url: '/weeklySummary.json'
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

    workitemService.updateTask = function(task, changeInTime) {
      var dueDate = task.date;
      var estimatedTime = parseFloat(task.time) * 60;
      var remainingTime = parseFloat(task.completedTime) * 60;  
      var title = task.name;
      changeInTime *= 60;
      var workitemObj = { id: task.id, due_date: dueDate, minutes_needed: estimatedTime, minutes_completed: remainingTime, content: title, active: true, 
        work_log: {
          change_in_time: parseInt(changeInTime)
        } 
      };
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

    workitemService.reevaluateTimeObj = function(workEstimate, timeObj) {
      return workitemResource.eventsToday().$promise.then(function(events) {
        var numMinutes = events.reduce(function(accum, eventObj) {
          accum += eventObj.end_time - eventObj.start_time;
          return accum;
        }, 0);
        var eventTime = numMinutes / 60;
        timeObj.eventTime = eventTime.toFixed(2);

        timeObj.totaltime = workEstimate.toFixed(2);
        var otherTime = 24 - workEstimate - eventTime;
        var leisuretime = 0;
        var sleeptime = 7;

        if (otherTime < 7) {
          sleeptime = otherTime < 0 ? 0 : otherTime;
          leisuretime = 0;
        } else {
          leisuretime = otherTime - 7;
        }
        timeObj.sleeptime = sleeptime.toFixed(2);
        timeObj.leisuretime = leisuretime.toFixed(2);
        return timeObj;
      });
      
    };

    workitemService.weeklySummary = function() {
      return workitemResource.weeklySummary().$promise.then(function(workSummary) {
        return workSummary;
      });
    }

  	return workitemService;
  }]);