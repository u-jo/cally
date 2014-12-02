app.controller('TaskModalCtrl',
  function ($scope, $modalInstance, $filter, tasks, task, edit, totalTimeObj, workitemService, eventService, makeBar, reevaluateTimeObj, displayEvents, events) {
  	$scope.itemType = 'task';
  	$scope.setItemType = function(type) {
  		$scope.opened = false;
  		$scope.itemType = type;
  	};
  	$scope.closeModal= function() {
		$modalInstance.dismiss('cancel');
  	};
  	$scope.edit = edit;
  	$scope.taskPrompt = edit === true ? 'Edit task' : 'Add Task';

  	$scope.minDate = new Date();

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
	$scope.formats = ['dd MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];

  	$scope.task = task;
  	$scope.reevaluateRemainder = function() {
  		$scope.tempTask.remainingTime = $scope.tempTask.time - $scope.tempTask.completedTime;
  	};
  	
	if ($scope.edit) {
		$scope.tempTask = angular.copy($scope.task);
		$scope.tempTask.date = 	$filter('date')($scope.tempTask.date, 'dd MMMM yyyy'); 
		$scope.reevaluateRemainder();
  	}
  	$scope.createTask = function() {
  		if (!edit) {
  			$scope.task.completedTime = 0;
			workitemService.createWorkitem($scope.task).then(function(taskResource) {
			tasks.push($scope.task);
	  			$scope.task.id = taskResource.id;
		  		var task = { id: taskResource.id, title: $scope.task.name, start: $scope.task.date, end: $scope.task.date, color: '#0266C8'};
				$('#calendar').fullCalendar('renderEvent', task, true);
				tasks = tasks.sort(function(a, b) {
		  			return a.date - b.date;
		  		});
		  		$modalInstance.dismiss('cancel');
		  		workitemService.getWorkEstimate().then(function(workEstimate) {
		  			reevaluateTimeObj(workEstimate, totalTimeObj).then(function() {
		  				makeBar();
		  			});
		  		});
			});
  		} else {
  			$scope.tempTask.name = $scope.task.name;

  			var changeInTime = parseFloat($scope.tempTask.completedTime) - $scope.task.completedTime;
			workitemService.updateTask($scope.tempTask, changeInTime).then(function(updatedTask) {
				$scope.task.time = updatedTask.time;
				$scope.task.completedTime = updatedTask.completedTime;
				$scope.task.id = updatedTask.id;
				$scope.task.date = updatedTask.date;
				var selectedTask = $('#calendar').fullCalendar( 'clientEvents', updatedTask.id)[0];
	  			selectedTask.start = updatedTask.date;
	  			selectedTask.end = updatedTask.date;
	  			selectedTask.title = updatedTask.name;
	  			$('#calendar').fullCalendar( 'updateEvent', selectedTask);
	  			tasks = tasks.sort(function(a, b) {
		  			return a.date - b.date;
		  		});
		  		workitemService.getWorkEstimate().then(function(workEstimate) {
		  			reevaluateTimeObj(workEstimate, totalTimeObj).then(function() {
		  				makeBar();
		  			});
		  			$modalInstance.dismiss('cancel');
		  		});
			});
	  		
  		}	
  	};
  	$scope.remainingTime = '';
  	
	//===== Event Creation =====//

	$scope.eventModel = {};

	$scope.createEvent = function() {
		var startTime = calculateMinutes($scope.eventModel.startTime);
		var endTime = calculateMinutes($scope.eventModel.endTime);
		var newEvent = {
			start_time : startTime,
			end_time : endTime,
			name : $scope.eventModel.name,
			date: $scope.eventModel.date
		};
		eventService.createEvent(newEvent).then(function(createdEvent) {

			var displayEventModel = eventService.toEventObj(createdEvent);
			var ev = {
				id: displayEventModel.eventID,
				start: displayEventModel.date,
				end: displayEventModel.date,
				title: displayEventModel.name,
				color: '#00933B'
			};
			$('#calendar').fullCalendar('renderEvent', ev, true);
			displayEvents.push(displayEventModel);
			displayEvents.sort(function(a,b) {
				return a.date <= b.date ? -1 : 1;
			});
			$modalInstance.dismiss('cancel');
		});
		
	};

	function calculateMinutes(date) {
		return date.getMinutes() + date.getHours() * 60;
	}

  });