app.controller('TaskModalCtrl',
  function ($scope, $modalInstance, tasks, task, edit) {
  	$scope.closeModal= function() {
		$modalInstance.dismiss('cancel');
  	};

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

  	$scope.createTask = function() {
  		if (!edit) {
  			tasks.push($scope.task);
	  		var task = { id: $scope.task.name, title: $scope.task.name, start: $scope.task.date, end: $scope.task.date};
			$('#calendar').fullCalendar('renderEvent', task, true);
  		} else {
  			var selectedTask = $('#calendar').fullCalendar( 'clientEvents', $scope.task.name)[0];
  			selectedTask.start = $scope.task.date;
  			selectedTask.end = $scope.task.date;
  			$('#calendar').fullCalendar( 'updateEvent', selectedTask);
  		}
  		

  		$modalInstance.dismiss('cancel');
  	};

  });