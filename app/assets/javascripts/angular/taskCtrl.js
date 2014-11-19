app.controller('TaskModalCtrl',
  function ($scope, $modalInstance, tasks, task, edit, totalTimeObj, workitemService) {
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
		  			totalTimeObj.totaltime = workEstimate;
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
	  		$modalInstance.dismiss('cancel');
  		}	
  	};
  	$scope.remainingTime = '';
  	

  });