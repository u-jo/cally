app.factory('eventService',
  function ($resource) {
  	var eventService = {};
    var eventResource = $resource('/event.json', {}, {
      updateEvent : {
        method : 'PUT',
        url : '/event.json'
      },
      deleteEvent : {
        method : 'DELETE',
        url : '/event.json'
      }
    });
    eventService.createEvent = function(eventModel) {
      return eventResource.save({'event': eventModel}).$promise.then(function(eventObj) {
        return eventObj;
      });
    };

    eventService.getEvents = function() {
      return eventResource.query().$promise.then(function(events) {
        return events;
      });
    };

    eventService.updateEvent = function(eventModel) {
      return eventResource.updateEvent(eventModel).$promise.then(function(updatedEvent) {
        return updatedEvent;
      }); 
    };

    eventService.deleteEvent = function(id) {
      return eventResource.deleteEvent({id : id}).$promise.then(function() {

      });
    };

    eventService.toEventObj = function(eventObj) {
      var startMinute = eventObj.start_time % 60;
      var startHour =  (eventObj.start_time - startMinute) / 60;
      var startTime = new Date(eventObj.date);
      startTime.setMinutes(startMinute);
      startTime.setHours(startHour);
      var endMinute = eventObj.end_time % 60;
      var endHour =  (eventObj.end_time- endMinute) / 60;
      var endTime = new Date(eventObj.date);
      endTime.setMinutes(endMinute);
      endTime.setHours(endHour);
      return {
        id: eventObj.id,
        name: eventObj.name,
        date : eventObj.date,
        startTime : startTime,
        endTime : endTime
      }
    };
  	return eventService;
  });