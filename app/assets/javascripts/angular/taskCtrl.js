app.controller('TaskModalCtrl',
  function ($scope, $modalInstance, $filter, tasks, task, edit, totalTimeObj, workitemService, makeBar, reevaluateTimeObj) {
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
		  		var task = { id: taskResource.id, title: $scope.task.name, start: $scope.task.date, end: $scope.task.date};
				$('#calendar').fullCalendar('renderEvent', task, true);
				tasks = tasks.sort(function(a, b) {
		  			return a.date - b.date;
		  		});
		  		$modalInstance.dismiss('cancel');
		  		workitemService.getWorkEstimate().then(function(workEstimate) {
		  			reevaluateTimeObj(workEstimate, totalTimeObj);
		  			makeBar();
		  		});
			});
  		} else {
  			$scope.tempTask.name = $scope.task.name;
			workitemService.updateTask($scope.tempTask).then(function(updatedTask) {
				$scope.task.time = updatedTask.time;
				$scope.task.completedTime = updatedTask.completedTime;
				$scope.task.id = updatedTask.id;
				$scope.task.date = updatedTask.date;
				var selectedTask = $('#calendar').fullCalendar( 'clientEvents', updatedTask.id)[0];
	  			selectedTask.start = updatedTask.date;
	  			selectedTask.end = updatedTask.date;
	  			$('#calendar').fullCalendar( 'updateEvent', selectedTask);
	  			tasks = tasks.sort(function(a, b) {
		  			return a.date - b.date;
		  		});
		  		workitemService.getWorkEstimate().then(function(workEstimate) {
		  			reevaluateTimeObj(workEstimate, totalTimeObj);
		  			makeBar();
		  			$modalInstance.dismiss('cancel');
		  		});
			});
	  		
  		}	
  	};
  	$scope.remainingTime = '';
  	

  });