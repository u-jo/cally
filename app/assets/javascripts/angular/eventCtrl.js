app.controller('EventModalCtrl',
  function ($scope, $modalInstance, $filter, eventService, eventObj, displayEvents) {
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
  		eventService.updateEvent(updatedEvent).then(function() {
        eventObj.startTime.setHours($scope.tempEventObj.startTime.getHours());
        eventObj.startTime.setMinutes($scope.tempEventObj.startTime.getMinutes());
        eventObj.endTime.setHours($scope.tempEventObj.endTime.getHours());
        eventObj.endTime.setMinutes($scope.tempEventObj.endTime.getMinutes());
        eventObj.name = $scope.tempEventObj.name;
        eventObj.date = $scope.tempEventObj.date;
        var selectedEvent = $('#calendar').fullCalendar( 'clientEvents', eventObj.eventID)[0];
        selectedEvent.start = eventObj.date;
        selectedEvent.end = eventObj.date;
        selectedEvent.title = eventObj.name;
        $('#calendar').fullCalendar( 'updateEvent', selectedEvent);
        displayEvents.sort(function(a,b) {
          return a.date <= b.date ? -1 : 1;
        });
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