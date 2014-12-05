app.controller('DashboardCtrl',['$scope', 'workitemService',
  function ($scope, workitemService) {
	$scope.date = new Date(); 
	$scope.workHours = [];
	$scope.leisureHours = [];
	$scope.sleepHours = [];
	$scope.timeObj = {};

	$scope.worktime = [];
	$scope.eventtime = [];
	$(document).ready(function() {
		// workitemService.getWorkEstimate().then(function(workEstimate) {
		// 	$scope.timeObj.worktime = workEstimate;
		// 	workitemService.reevaluateTimeObj(workEstimate, $scope.timeObj);
		// 	$scope.workHours = [parseFloat($scope.timeObj.worktime), 0, 0];
		// 	$scope.leisureHours = [0, parseFloat($scope.timeObj.leisuretime), 0];
		// 	$scope.sleepHours = [0, 0, parseFloat($scope.timeObj.sleeptime)];
		// 	$scope.makeBar();
		// });

		workitemService.weeklySummary().then(function(weeklySummary) {
			$scope.worktime = weeklySummary.work_time;
			$scope.eventtime = weeklySummary.event_time;
			$scope.makeBar();
		});	

	});

	$scope.makeBar = function() {
		    $('#summary-bar').highcharts({
		        title: {
		            text: 'Weekly Summary',
		            x: -20 //center
		        },
		        xAxis: {
		            categories: ['Mon',' Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		        },
		        yAxis: {
		            title: {
		                text: 'Time (hr)'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }],
		            min: 0,
		            max: 24
		        },
		        tooltip: {
		            valueSuffix: '°C'
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'right',
		            verticalAlign: 'middle',
		            borderWidth: 0
		        },
		        series: [{
		            name: 'Work',
		            color: '#0266C8',
		            data: $scope.worktime
		        }, {
		            name: 'Events',
		            color: '#00933B',
		            data: $scope.eventtime
		        }],
		        exporting: {
				    enabled: false
				},
				credits: {
		            enabled: false
		        },
		        tooltip: {
		        	pointFormat : '{series.name}: <b>{point.y}</b><br/>',
		        	headerFormat : ''
		        },
		    });
	};
  }]);