app.controller('TaskModalCtrl',
  function ($scope, $modalInstance, tasks, task, edit, totalTimeObj, workitemService, makeBar) {
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
  		if ($scope.edit) {
  			$scope.task.remainingTime = $scope.task.time - $scope.task.completedTime;
  		}
  	};
	if ($scope.edit) {
  		$scope.reevaluateRemainder();
  	}
  	$scope.createTask = function() {
  		if (!edit) {
  			$scope.task.completedTime = 0;
			workitemService.createWorkitem($scope.task).then(function(taskResource) {
				tasks.push($scope.task);
	  			$scope.task.id = taskResource;
		  		var task = { id: taskResource.id, title: $scope.task.name, start: $scope.task.date, end: $scope.task.date};
				$('#calendar').fullCalendar('renderEvent', task, true);
				tasks = tasks.sort(function(a, b) {
		  			return a.date - b.date;
		  		});
		  		$modalInstance.dismiss('cancel');
		  		workitemService.getWorkEstimate().then(function(workEstimate) {
		  			calculateOtherTimes(workEstimate);
		  			makeBar();
		  		});


			});
  		} else {
  			var selectedTask = $('#calendar').fullCalendar( 'clientEvents', $scope.task.id)[0];
  			selectedTask.start = $scope.task.date;
  			selectedTask.end = $scope.task.date;
  			$('#calendar').fullCalendar( 'updateEvent', selectedTask);
  			tasks = tasks.sort(function(a, b) {
	  			return a.date - b.date;
	  		});
	  		workitemService.getWorkEstimate().then(function(workEstimate) {
	  			calculateOtherTimes(workEstimate);
	  			makeBar();
	  		});
	  		$modalInstance.dismiss('cancel');
  		}	
  	};

  	function calculateOtherTimes(workEstimate) {
  		totalTimeObj.totaltime = workEstimate.toFixed(2);
		var otherTime = 24 - workEstimate;
		var leisuretime = 0;
		var sleeptime = 7;

		if (otherTime < 0) {
			sleeptime = 0;
			leisuretime = 0;
		} else {
			if (otherTime > 7) {
				leisuretime = otherTime - 7;
			}
		}
		totalTimeObj.sleeptime = sleeptime.toFixed(2);
		totalTimeObj.leisuretime = leisuretime.toFixed(2);
  	}
  	$scope.remainingTime = '';
  	

  });