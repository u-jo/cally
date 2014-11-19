var app = angular
  .module('CallyApp', [
    'ui.bootstrap',
    'templates'
  ]).config(function (datepickerConfig, datepickerPopupConfig) {
      datepickerConfig.showWeeks = false;
      datepickerPopupConfig.showButtonBar = false;
    });


$(document).on('ready page:load', function() {
	angular.bootstrap(document.body, ['CallyApp']);
});
