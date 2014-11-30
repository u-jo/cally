app.controller('DashboardCtrl',
  function ($scope, workitemService) {
	$scope.date = new Date(); 
	$scope.workHours = [];
	$scope.leisureHours = [];
	$scope.sleepHours = [];
	$scope.timeObj = {};
	$(document).ready(function() {
		workitemService.getWorkEstimate().then(function(workEstimate) {
			$scope.timeObj.worktime = workEstimate;
			workitemService.reevaluateTimeObj(workEstimate, $scope.timeObj);
			$scope.workHours = [parseFloat($scope.timeObj.worktime), 0, 0];
			$scope.leisureHours = [0, parseFloat($scope.timeObj.leisuretime), 0];
			$scope.sleepHours = [0, 0, parseFloat($scope.timeObj.sleeptime)];
			$scope.makeBar();
		});
	});

	$scope.makeBar = function() {
		$('#summary-bar').highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: 'Today\'s breakdown'
	        },
	        xAxis: {
	            categories: ['Work', 'Leisure', 'Sleep']
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: 'Time (hours)'
	            },
	            max: 30
	        },
	        credits: {
	            enabled: false
	        },
	        legend: {
	            reversed: true
	        },
	        tooltip: {
	        	pointFormat : '{series.name}: <b>{point.y}</b><br/>',
	        	headerFormat : ''
	        },
	        plotOptions: {
	            series: {
	                stacking: 'normal',
	                events: {
	                    legendItemClick: function () {
	                        return false; // <== returning false will cancel the default action
	                    }
	                }
	            },
	            allowPointSelect: false
	        },
	        series: [{
	            name: 'Work',
	            data: $scope.workHours
	        }, {
	            name: 'Leisure',
	            data: $scope.leisureHours
	        }, {
	            name: 'Sleep',
	            data: $scope.sleepHours
	        }],
	        exporting: {
			    enabled: false
			}
	    });
	};
  });