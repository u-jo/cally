app.controller('EventModalCtrl',
  function ($scope, $modalInstance, $filter, eventService, eventObj) {
  	$scope.closeModal= function() {
		  $modalInstance.dismiss('cancel');
  	};
  	$scope.tempEventObj = angular.copy(eventObj);
  	$scope.tempEventObj.date = $filter('date')($scope.tempEventObj.date, 'dd MMMM yyyy'); 

  	$scope.updateEvent = function() {
      var startTime = calculateMinutes($scope.tempEventObj.startTime);
      var endTime = calculateMinutes($scope.tempEventObj.endTime);
      var updatedEvent = {
        start_time : startTime,
        end_time : endTime,
        name : $scope.tempEventObj.name,
        date: $scope.tempEventObj.date,
        id : $scope.tempEventObj.id
      };
  		eventService.updateEvent(updatedEvent).then(function(eventObj) {
  			$modalInstance.dismiss('cancel');
  		});
  	};

    $scope.formats = ['dd MMMM yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.minDate = new Date();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    function calculateMinutes(date) {
      return date.getMinutes() + date.getHours() * 60;
    }

  	
  });